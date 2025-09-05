from fastapi import FastAPI
from pydantic import BaseModel
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_openai import ChatOpenAI
from langchain_pinecone import PineconeVectorStore
from langchain.memory import ConversationBufferMemory
from fastapi.middleware.cors import CORSMiddleware
from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv
import os
# from tortoise.contrib.fastapi import register_tortoise # For DB
# My files
# from system_prompt import system_prompt
# from conatct_prompt import form_prompt

load_dotenv()

class Chat(BaseModel):
    message : str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://basic-bot-jwvk.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
POSTGRES_DB = os.getenv("POSTGRES_DB")

index_name = "test"

embeddings = OpenAIEmbeddings(api_key=OPENAI_API_KEY)
documents = PineconeVectorStore.from_existing_index(
    index_name=index_name,
    embedding=embeddings
)
retriever = documents.as_retriever(search_type = 'similarity', search_kwargs = {'k':3})

llm = ChatOpenAI(api_key = OPENAI_API_KEY)

def system_prompt(ChatPromptTemplate):
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
        ("human", "{input}")
        ])
    return system_prompt

def form_prompt(ChatPromptTemplate):
    form_prompt = (
        "You are the context identifier"
        # "You will only tell that the user wants to stay in touch with you"
        "give me the context in one word"
    )

    form_prompt = ChatPromptTemplate.from_messages([
        ("system",form_prompt),
        ('human', "{input}")
    ])
    return form_prompt

chat_prompt = system_prompt(ChatPromptTemplate)
question_answer_chain = create_stuff_documents_chain(llm, chat_prompt)
rag_chain = create_retrieval_chain(retriever, question_answer_chain)

contact_prompt = form_prompt(ChatPromptTemplate)
chain = contact_prompt | llm


@app.post('/chat')
def chatting(arg:Chat):
    response = rag_chain.invoke({'input': arg.message})
    contact_response = chain.invoke({"input" : arg.message})
    if contact_response.content.lower() == "communication":
        contact = True
    else:
        contact = False
    return {"bot" : response["answer"], "contact" : contact}

# register_tortoise(
#     app,
#     db_url=POSTGRES_DB,
#     modules={"models": ["modules.chat_tb"]},
#     generate_schemas=True,
#     add_exception_handlers=True,
# )