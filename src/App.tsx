import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const { user, signOut } = useAuthenticator();

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <button onClick={createTodo} className="text-white bg-blue-400 p-2 rounded-xl w-56">+ new</button>
      <h1 className="mt-10 text-xl font-bold">Todos</h1>
      <ul>
        {todos.map((todo) => (<li
          className="mt-2 bg-gray-300 p-2 rounded-xl w-fit"
          onClick={() => deleteTodo(todo.id)}
          key={todo.id}>
          {todo.content}
        </li>
        ))}
      </ul>
      <div className="text-center mt-15">
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates" 
          className="text-blue-600 underline"
        >
          Review next step of this tutorial.
        </a>
      </div>
      <button onClick={signOut} className="mt-10 text-white bg-red-500 p-2 rounded-xl w-56">Sign out</button>
    </main>
  );
}

export default App;
