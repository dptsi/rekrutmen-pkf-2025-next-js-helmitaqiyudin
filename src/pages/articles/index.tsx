import { Heading, Container, Flex, Card, Button, Text } from "@chakra-ui/react";
import { articleService, Comment } from "@/services/api";
import { Article } from "@/services/api";
import { useEffect, useState } from "react";

export default function Articles() {
    const [article, setArticle] = useState<Article[]>([]);
    const [articlesOffset, setArticlesOffset] = useState<number>(0);
    const [selectedArticleId, setSelectedArticleId] = useState<string>("");
    const [comments, setComments] = useState<Comment[]>([]);
    const [loadingArticles, setLoadingArticles] = useState<boolean>(false);
    const [loadingComments, setLoadingComments] = useState<boolean>(false);

    useEffect(() => {
        const fetchArticles = async () => {
            setLoadingArticles(true);
            try {
                const response = await articleService.getArticles(10, articlesOffset);
                if (response.status === "success") {
                    setArticle(prevArticles => [...prevArticles, ...response.data]);
                    setLoadingArticles(false);
                } else {
                    console.error("Error fetching articles:", response.message);
                    setLoadingArticles(false);
                }
            } catch (error) {
                console.error("Error fetching articles:", error);
                setLoadingArticles(false);
            }
        };

        fetchArticles();
    }, [articlesOffset]);

    useEffect(() => {
        const fetchComments = async (articleId: string) => {
            setLoadingComments(true);
            try {
                const response = await articleService.getComments(articleId);
                if (response.status === "success") {
                    setComments(response.data);
                    setLoadingComments(false);
                } else {
                    console.error("Error fetching comments:", response.message);
                    setLoadingComments(false);
                }
            } catch (error) {
                console.error("Error fetching comments:", error);
                setLoadingComments(false);
            }
        };

        if (selectedArticleId) {
            fetchComments(selectedArticleId);
        }
    }, [selectedArticleId]);

    return (
        <Container py={30} maxW={"container.lg"}>
            <Heading>
                Articles
            </Heading>


            {article.length === 0 && !loadingArticles ? (
                <Text id="articles-empty-message" mt={4}>No articles found</Text>
            ) :
                <Flex flexDirection={"column"} align={"center"} id={loadingArticles ? "articles-loading" : ""}>
                    {article.map((article: Article) => (
                        <Card key={article.id} p={2} m={2} width="full">
                            <Heading size="md" id={`article-item-${article.id}-title`}>{article.title}</Heading>
                            <Text id={`article-item-${article.id}-creator`}>{article.creator_name}</Text>
                            {article.comments_count === 0 ? (
                                <Text id={`article-item-${article.id}-comments-empty`}>No comments yet</Text>
                            ) : (
                                <Text id={`article-item-${article.id}-comments`}>{article.comments_count} Comments</Text>
                            )}
                            {
                                selectedArticleId === article.id ? (
                                    <Flex id={loadingComments ? `article-item-${article.id}-comments-loading` : `article-item-${article.id}-comments-container`} flexDir={"column"} mt={1} gap={3}>
                                        {comments.map((comment: Comment) => (
                                            <div key={comment.id}>
                                                <Text id={`article-item-${article.id}-comment-${comment.id}-creator`} as={"b"}>{comment.creator_name}</Text>
                                                <Text id={`article-item-${article.id}-comment-${comment.id}-content`}>{comment.content}</Text>
                                            </div>
                                        ))}
                                    </Flex>
                                ) : (
                                    <Button
                                        id={`article-item-${article.id}-view-btn`}
                                        isLoading={loadingComments}
                                        onClick={() => {
                                            setSelectedArticleId(article.id);
                                            setComments([]);
                                        }}
                                        size="sm">View Comments</Button>
                                )
                            }
                        </Card>
                    ))}
                </Flex>
            }

            <Flex justifyContent={"center"} mt={4}>
                <Button
                    isLoading={loadingArticles}
                    onClick={() =>
                        setArticlesOffset(articlesOffset + 10)
                    } size="md"
                    id={loadingArticles ? "load-more-loading" : "load-more-btn"}
                >
                    Load More
                </Button>
            </Flex>
        </Container>
    )
}