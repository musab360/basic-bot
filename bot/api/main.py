from fastapi import FastAPI
from pydantic import BaseModel
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_openai import ChatOpenAI
from langchain_pinecone import PineconeVectorStore
from fastapi.middleware.cors import CORSMiddleware
from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv
import os

load_dotenv()

class Chat(BaseModel):
    message : str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

index_name = "test"

embeddings = OpenAIEmbeddings(api_key=OPENAI_API_KEY)
documents = PineconeVectorStore.from_existing_index(
    index_name=index_name,
    embedding=embeddings
)
retriever = documents.as_retriever(search_type = 'similarity', search_kwargs = {'k':3})

llm = ChatOpenAI(api_key = OPENAI_API_KEY)
system_prompt = (
    "You are an assistant for question-answering tasks. "
    "Use the following pieces of retrieved context to answer "
    "the question. If you don't know the answer, say that you "
    "don't know. keep the "
    "answer concise and short."
    "Give the answers in markdown format"
    "\n\n"
    "{context}"
)

system_prompt = ChatPromptTemplate.from_messages(
[
    ("system", system_prompt),
    ("human", "{input}"),
]
)

question_answer_chain = create_stuff_documents_chain(llm, system_prompt)
rag_chain = create_retrieval_chain(retriever, question_answer_chain)

@app.post('/chat')
def chatting(arg:Chat):
    response = rag_chain.invoke({'input': arg.message})
    return response["answer"]