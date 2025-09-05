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