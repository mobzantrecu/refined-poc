package com.bewise.backend.service.mapper;

import com.bewise.backend.domain.Post;
import com.bewise.backend.service.dto.PostDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Post} and its DTO {@link PostDTO}.
 */
@Mapper(componentModel = "spring")
public interface PostMapper extends EntityMapper<PostDTO, Post> {}
