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