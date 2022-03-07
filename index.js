import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

app.get("/todos", async (req, res) => {
  const posts = await prisma.todoItem.findMany({
    where: {
      author: {
        email: "cristian.penarrieta@gmail.com",
      },
    },
  });
  res.json(posts);
});


// creates a todo item 
app.post("/todos", async (req, res) => {
 const {title, authorEmail} = req.body;
 const todoItem = await prisma.todoItem.create({
   data: {
     title,
     author:{ connect: { email: authorEmail } },
   },
  });
  res.json(todoItem);
});

// deletes a todo item by id
app.delete("/todos/:id", async (req, res) =>{
  const deleteTodoItem = await prisma.todoItem.delete({
    where: {
      id: req.params.id,
    }
  });
});

// get a todo item by id
app.get("/todos/:id", async (req, res) =>{
  const todoItem = await prisma.todoItem.findUnique({
    where: {
      id: req.params.id,
    }
  });
  if(todoItem) {
    res.status(200).json(todoItem);
  } else{
    res.status(404).send(`todo item id: ${req.params.id} not found`);
  }
});

// updates a todo item by id
app.put("/todos/:id", async (req, res) =>{
  const body = req.body;
  const todoItem = await prisma.todoItem.update({
    where: {
      id: req.params.id,
    },
    data: {
      title : body.title,
      author:{ connect: { email: body.authorEmail } },
    },
  });
  res.json(todoItem);
});

app.listen(8000, () => {
  console.log("Server running on http://localhost:8000 🎉 🚀");
});
