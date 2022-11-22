export interface IPostFace {
    id: number;
    title: string;
    status: "published" | "draft" | "rejected";
    createdAt: string;
}