# Grabs random wikipedia articles and adds their full article text into the words.txt file

import wikipediaapi
from wikipediaapi._enums import RedirectFilter

wiki = wikipediaapi.Wikipedia(user_agent="Gub (https://www.Gub.com/real/)", language="en", extract_format=wikipediaapi.ExtractFormat.WIKI)

pages = wiki.random(filter_redirect=RedirectFilter.NONREDIRECTS, limit=5000)

for page in pages.values(): 
    text = page.text
    
    with open("words.txt", "r", encoding="utf-8") as txt:
        lines = txt.readlines()
        with open("words.txt", "a", encoding="utf-8") as txt:
            try:
                txt.write(text + "\n")
                txt.close()
            except Exception as e:
                print("Failed! Reason: ", e)
                print("Continuing")
                for line in lines:
                    if len(line.strip('\n')) >= 0:
                        txt.write(line)
                continue