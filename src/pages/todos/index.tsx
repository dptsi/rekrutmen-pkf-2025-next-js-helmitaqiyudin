import { Heading, Container, Flex, Card, Button, Text, FormControl, FormLabel, FormErrorMessage, Input } from "@chakra-ui/react";
import { todoService, Todo } from "@/services/api";
import { useEffect, useState } from "react";

export default function Articles() {

    const [todos, setTodos] = useState<Todo[]>([]);
    const [loadingTodos, setLoadingTodos] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [todoTitle, setTodoTitle] = useState<string>("");

    const createTodo = async (title: string) => {
        try {
            const response = await todoService.createTodo(title);
            if (response.status === "success") {
                setTodos(prevTodos => [...prevTodos, response.data]);
                setErrorMessage("");
            } else {
                setErrorMessage(response.message);
            }
        } catch (error) {
            console.error("Error creating todo:", error);
            setErrorMessage("Failed to create todo");
        }
    }

    useEffect(() => {
        const validateTodoTitle = () => {
            if (todoTitle.trim() === "") {
                setErrorMessage("Todo title cannot be empty");
            }
            else if (todoTitle.length < 3) {
                setErrorMessage("Todo title must be at least 3 characters long");
            }
            else if (todoTitle.length > 50) {
                setErrorMessage("Todo title must be less than 50 characters long");
            } else {
                setErrorMessage("");
            }
        }
        validateTodoTitle();
    }, []);

    return (
        <Container py={30} maxW={"container.lg"}>
            <Heading>
                Todo List Management
            </Heading>


            <Flex flexDirection={"column"} align={"center"}>
                <FormControl isInvalid={!!errorMessage} mt={4}>
                    <FormLabel>Todo Title</FormLabel>
                    <Input id="todo-form-input" type="text" value={todoTitle} onChange={(e) => setTodoTitle(e.target.value)} placeholder="Enter todo title" />
                    <FormErrorMessage id="todo-form-error">{errorMessage}</FormErrorMessage>
                    <Button id="todo-form-submit" onClick={() => createTodo(todoTitle)} mt={4}>
                        Submit
                    </Button>
                </FormControl>
            </Flex>
        </Container>
    )
}