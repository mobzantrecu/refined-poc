package com.bewise.backend.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.bewise.backend.IntegrationTest;
import com.bewise.backend.domain.Post;
import com.bewise.backend.repository.PostRepository;
import com.bewise.backend.service.criteria.PostCriteria;
import com.bewise.backend.service.dto.PostDTO;
import com.bewise.backend.service.mapper.PostMapper;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link PostResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PostResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final Instant DEFAULT_CREATED_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/posts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private PostMapper postMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPostMockMvc;

    private Post post;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Post createEntity(EntityManager em) {
        Post post = new Post().title(DEFAULT_TITLE).status(DEFAULT_STATUS).createdAt(DEFAULT_CREATED_AT);
        return post;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Post createUpdatedEntity(EntityManager em) {
        Post post = new Post().title(UPDATED_TITLE).status(UPDATED_STATUS).createdAt(UPDATED_CREATED_AT);
        return post;
    }

    @BeforeEach
    public void initTest() {
        post = createEntity(em);
    }

    @Test
    @Transactional
    void createPost() throws Exception {
        int databaseSizeBeforeCreate = postRepository.findAll().size();
        // Create the Post
        PostDTO postDTO = postMapper.toDto(post);
        restPostMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(postDTO)))
            .andExpect(status().isCreated());

        // Validate the Post in the database
        List<Post> postList = postRepository.findAll();
        assertThat(postList).hasSize(databaseSizeBeforeCreate + 1);
        Post testPost = postList.get(postList.size() - 1);
        assertThat(testPost.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testPost.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testPost.getCreatedAt()).isEqualTo(DEFAULT_CREATED_AT);
    }

    @Test
    @Transactional
    void createPostWithExistingId() throws Exception {
        // Create the Post with an existing ID
        post.setId(1L);
        PostDTO postDTO = postMapper.toDto(post);

        int databaseSizeBeforeCreate = postRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPostMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(postDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Post in the database
        List<Post> postList = postRepository.findAll();
        assertThat(postList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPosts() throws Exception {
        // Initialize the database
        postRepository.saveAndFlush(post);

        // Get all the postList
        restPostMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(post.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(DEFAULT_CREATED_AT.toString())));
    }

    @Test
    @Transactional
    void getPost() throws Exception {
        // Initialize the database
        postRepository.saveAndFlush(post);

        // Get the post
        restPostMockMvc
            .perform(get(ENTITY_API_URL_ID, post.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(post.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS))
            .andExpect(jsonPath("$.createdAt").value(DEFAULT_CREATED_AT.toString()));
    }

    @Test
    @Transactional
    void getPostsByIdFiltering() throws Exception {
        // Initialize the database
        postRepository.saveAndFlush(post);

        Long id = post.getId();

        defaultPostShouldBeFound("id.equals=" + id);
        defaultPostShouldNotBeFound("id.notEquals=" + id);

        defaultPostShouldBeFound("id.greaterThanOrEqual=" + id);
        defaultPostShouldNotBeFound("id.greaterThan=" + id);

        defaultPostShouldBeFound("id.lessThanOrEqual=" + id);
        defaultPostShouldNotBeFound("id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllPostsByTitleIsEqualToSomething() throws Exception {
        // Initialize the database
        postRepository.saveAndFlush(post);

        // Get all the postList where title equals to DEFAULT_TITLE
        defaultPostShouldBeFound("title.equals=" + DEFAULT_TITLE);

        // Get all the postList where title equals to UPDATED_TITLE
        defaultPostShouldNotBeFound("title.equals=" + UPDATED_TITLE);
    }

    @Test
    @Transactional
    void getAllPostsByTitleIsInShouldWork() throws Exception {
        // Initialize the database
        postRepository.saveAndFlush(post);

        // Get all the postList where title in DEFAULT_TITLE or UPDATED_TITLE
        defaultPostShouldBeFound("title.in=" + DEFAULT_TITLE + "," + UPDATED_TITLE);

        // Get all the postList where title equals to UPDATED_TITLE
        defaultPostShouldNotBeFound("title.in=" + UPDATED_TITLE);
    }

    @Test
    @Transactional
    void getAllPostsByTitleIsNullOrNotNull() throws Exception {
        // Initialize the database
        postRepository.saveAndFlush(post);

        // Get all the postList where title is not null
        defaultPostShouldBeFound("title.specified=true");

        // Get all the postList where title is null
        defaultPostShouldNotBeFound("title.specified=false");
    }

    @Test
    @Transactional
    void getAllPostsByTitleContainsSomething() throws Exception {
        // Initialize the database
        postRepository.saveAndFlush(post);

        // Get all the postList where title contains DEFAULT_TITLE
        defaultPostShouldBeFound("title.contains=" + DEFAULT_TITLE);

        // Get all the postList where title contains UPDATED_TITLE
        defaultPostShouldNotBeFound("title.contains=" + UPDATED_TITLE);
    }

    @Test
    @Transactional
    void getAllPostsByTitleNotContainsSomething() throws Exception {
        // Initialize the database
        postRepository.saveAndFlush(post);

        // Get all the postList where title does not contain DEFAULT_TITLE
        defaultPostShouldNotBeFound("title.doesNotContain=" + DEFAULT_TITLE);

        // Get all the postList where title does not contain UPDATED_TITLE
        defaultPostShouldBeFound("title.doesNotContain=" + UPDATED_TITLE);
    }

    @Test
    @Transactional
    void getAllPostsByStatusIsEqualToSomething() throws Exception {
        // Initialize the database
        postRepository.saveAndFlush(post);

        // Get all the postList where status equals to DEFAULT_STATUS
        defaultPostShouldBeFound("status.equals=" + DEFAULT_STATUS);

        // Get all the postList where status equals to UPDATED_STATUS
        defaultPostShouldNotBeFound("status.equals=" + UPDATED_STATUS);
    }

    @Test
    @Transactional
    void getAllPostsByStatusIsInShouldWork() throws Exception {
        // Initialize the database
        postRepository.saveAndFlush(post);

        // Get all the postList where status in DEFAULT_STATUS or UPDATED_STATUS
        defaultPostShouldBeFound("status.in=" + DEFAULT_STATUS + "," + UPDATED_STATUS);

        // Get all the postList where status equals to UPDATED_STATUS
        defaultPostShouldNotBeFound("status.in=" + UPDATED_STATUS);
    }

    @Test
    @Transactional
    void getAllPostsByStatusIsNullOrNotNull() throws Exception {
        // Initialize the database
        postRepository.saveAndFlush(post);

        // Get all the postList where status is not null
        defaultPostShouldBeFound("status.specified=true");

        // Get all the postList where status is null
        defaultPostShouldNotBeFound("status.specified=false");
    }

    @Test
    @Transactional
    void getAllPostsByStatusContainsSomething() throws Exception {
        // Initialize the database
        postRepository.saveAndFlush(post);

        // Get all the postList where status contains DEFAULT_STATUS
        defaultPostShouldBeFound("status.contains=" + DEFAULT_STATUS);

        // Get all the postList where status contains UPDATED_STATUS
        defaultPostShouldNotBeFound("status.contains=" + UPDATED_STATUS);
    }

    @Test
    @Transactional
    void getAllPostsByStatusNotContainsSomething() throws Exception {
        // Initialize the database
        postRepository.saveAndFlush(post);

        // Get all the postList where status does not contain DEFAULT_STATUS
        defaultPostShouldNotBeFound("status.doesNotContain=" + DEFAULT_STATUS);

        // Get all the postList where status does not contain UPDATED_STATUS
        defaultPostShouldBeFound("status.doesNotContain=" + UPDATED_STATUS);
    }

    @Test
    @Transactional
    void getAllPostsByCreatedAtIsEqualToSomething() throws Exception {
        // Initialize the database
        postRepository.saveAndFlush(post);

        // Get all the postList where createdAt equals to DEFAULT_CREATED_AT
        defaultPostShouldBeFound("createdAt.equals=" + DEFAULT_CREATED_AT);

        // Get all the postList where createdAt equals to UPDATED_CREATED_AT
        defaultPostShouldNotBeFound("createdAt.equals=" + UPDATED_CREATED_AT);
    }

    @Test
    @Transactional
    void getAllPostsByCreatedAtIsInShouldWork() throws Exception {
        // Initialize the database
        postRepository.saveAndFlush(post);

        // Get all the postList where createdAt in DEFAULT_CREATED_AT or UPDATED_CREATED_AT
        defaultPostShouldBeFound("createdAt.in=" + DEFAULT_CREATED_AT + "," + UPDATED_CREATED_AT);

        // Get all the postList where createdAt equals to UPDATED_CREATED_AT
        defaultPostShouldNotBeFound("createdAt.in=" + UPDATED_CREATED_AT);
    }

    @Test
    @Transactional
    void getAllPostsByCreatedAtIsNullOrNotNull() throws Exception {
        // Initialize the database
        postRepository.saveAndFlush(post);

        // Get all the postList where createdAt is not null
        defaultPostShouldBeFound("createdAt.specified=true");

        // Get all the postList where createdAt is null
        defaultPostShouldNotBeFound("createdAt.specified=false");
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultPostShouldBeFound(String filter) throws Exception {
        restPostMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(post.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(DEFAULT_CREATED_AT.toString())));

        // Check, that the count call also returns 1
        restPostMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultPostShouldNotBeFound(String filter) throws Exception {
        restPostMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restPostMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingPost() throws Exception {
        // Get the post
        restPostMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewPost() throws Exception {
        // Initialize the database
        postRepository.saveAndFlush(post);

        int databaseSizeBeforeUpdate = postRepository.findAll().size();

        // Update the post
        Post updatedPost = postRepository.findById(post.getId()).get();
        // Disconnect from session so that the updates on updatedPost are not directly saved in db
        em.detach(updatedPost);
        updatedPost.title(UPDATED_TITLE).status(UPDATED_STATUS).createdAt(UPDATED_CREATED_AT);
        PostDTO postDTO = postMapper.toDto(updatedPost);

        restPostMockMvc
            .perform(
                put(ENTITY_API_URL_ID, postDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(postDTO))
            )
            .andExpect(status().isOk());

        // Validate the Post in the database
        List<Post> postList = postRepository.findAll();
        assertThat(postList).hasSize(databaseSizeBeforeUpdate);
        Post testPost = postList.get(postList.size() - 1);
        assertThat(testPost.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testPost.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testPost.getCreatedAt()).isEqualTo(UPDATED_CREATED_AT);
    }

    @Test
    @Transactional
    void putNonExistingPost() throws Exception {
        int databaseSizeBeforeUpdate = postRepository.findAll().size();
        post.setId(count.incrementAndGet());

        // Create the Post
        PostDTO postDTO = postMapper.toDto(post);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPostMockMvc
            .perform(
                put(ENTITY_API_URL_ID, postDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(postDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Post in the database
        List<Post> postList = postRepository.findAll();
        assertThat(postList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPost() throws Exception {
        int databaseSizeBeforeUpdate = postRepository.findAll().size();
        post.setId(count.incrementAndGet());

        // Create the Post
        PostDTO postDTO = postMapper.toDto(post);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPostMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(postDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Post in the database
        List<Post> postList = postRepository.findAll();
        assertThat(postList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPost() throws Exception {
        int databaseSizeBeforeUpdate = postRepository.findAll().size();
        post.setId(count.incrementAndGet());

        // Create the Post
        PostDTO postDTO = postMapper.toDto(post);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPostMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(postDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Post in the database
        List<Post> postList = postRepository.findAll();
        assertThat(postList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePostWithPatch() throws Exception {
        // Initialize the database
        postRepository.saveAndFlush(post);

        int databaseSizeBeforeUpdate = postRepository.findAll().size();

        // Update the post using partial update
        Post partialUpdatedPost = new Post();
        partialUpdatedPost.setId(post.getId());

        restPostMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPost.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPost))
            )
            .andExpect(status().isOk());

        // Validate the Post in the database
        List<Post> postList = postRepository.findAll();
        assertThat(postList).hasSize(databaseSizeBeforeUpdate);
        Post testPost = postList.get(postList.size() - 1);
        assertThat(testPost.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testPost.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testPost.getCreatedAt()).isEqualTo(DEFAULT_CREATED_AT);
    }

    @Test
    @Transactional
    void fullUpdatePostWithPatch() throws Exception {
        // Initialize the database
        postRepository.saveAndFlush(post);

        int databaseSizeBeforeUpdate = postRepository.findAll().size();

        // Update the post using partial update
        Post partialUpdatedPost = new Post();
        partialUpdatedPost.setId(post.getId());

        partialUpdatedPost.title(UPDATED_TITLE).status(UPDATED_STATUS).createdAt(UPDATED_CREATED_AT);

        restPostMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPost.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPost))
            )
            .andExpect(status().isOk());

        // Validate the Post in the database
        List<Post> postList = postRepository.findAll();
        assertThat(postList).hasSize(databaseSizeBeforeUpdate);
        Post testPost = postList.get(postList.size() - 1);
        assertThat(testPost.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testPost.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testPost.getCreatedAt()).isEqualTo(UPDATED_CREATED_AT);
    }

    @Test
    @Transactional
    void patchNonExistingPost() throws Exception {
        int databaseSizeBeforeUpdate = postRepository.findAll().size();
        post.setId(count.incrementAndGet());

        // Create the Post
        PostDTO postDTO = postMapper.toDto(post);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPostMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, postDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(postDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Post in the database
        List<Post> postList = postRepository.findAll();
        assertThat(postList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPost() throws Exception {
        int databaseSizeBeforeUpdate = postRepository.findAll().size();
        post.setId(count.incrementAndGet());

        // Create the Post
        PostDTO postDTO = postMapper.toDto(post);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPostMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(postDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Post in the database
        List<Post> postList = postRepository.findAll();
        assertThat(postList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPost() throws Exception {
        int databaseSizeBeforeUpdate = postRepository.findAll().size();
        post.setId(count.incrementAndGet());

        // Create the Post
        PostDTO postDTO = postMapper.toDto(post);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPostMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(postDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Post in the database
        List<Post> postList = postRepository.findAll();
        assertThat(postList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePost() throws Exception {
        // Initialize the database
        postRepository.saveAndFlush(post);

        int databaseSizeBeforeDelete = postRepository.findAll().size();

        // Delete the post
        restPostMockMvc
            .perform(delete(ENTITY_API_URL_ID, post.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Post> postList = postRepository.findAll();
        assertThat(postList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
