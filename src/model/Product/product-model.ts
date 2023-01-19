import title from '../../decorators/title.decorator';
import { AntdEntity } from '../../decorators/AntdEntity';
import { Tag } from 'antd';
import render from '../../decorators/render.decorator';
import { Rule } from 'antd/lib/form';
import JoinColumn from '../../decorators/joinColumn.decorator';
import { User } from './user-model';

// TODO: write function and move to other file
function rules(...rulesToApply: Rule[]) {
    return Reflect.metadata('test', 'test');
}

@AntdEntity()
export class Post {
    id: number | undefined;

    @title('Title test')
    @rules({ required: true })
    title: string = '';

    @render(Tag)
    status: string = '';

    createdAt: Date | undefined;

    @JoinColumn('users', 'id', 'firstName')
    @title('Usuario')
    user: User = new User();
}
