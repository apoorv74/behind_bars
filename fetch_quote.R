
fetchquote <- function(){
library(rvest)

#Daily Zen URL
url <- "https://www.dailyzen.com/"

# Fetching quote

quote_status <- 0
tryCatch({
  quote <- url %>% read_html() %>% html_nodes(css = ".zen--quote") %>% html_text()
  # quote <- stringr::str_replace_all(quote, "\\n", "")
  quote <- stringr::str_trim(unlist(stringr::str_split(quote, pattern = "\\t")))
  quote <- quote[!quote %in% ""]
  names(quote) <- c("date", "quote", "author")
  quote["author"] <- stringr::str_replace(quote["author"], "- ","")
  quote_status <- 1
}, error = function(e){
  print("looks like daily zen is down")
})


# Fall back to the default quote if daily zen is down
if(quote_status == 0){
  quote["date"] <-  date()
  quote["quote"] <- "Put aside every form of belief, then there is no fear whatsoever"
  quote["author"] <- "J. Krishnamurti"
}


# Replacing the _index.md file inside content

file_path <- "content/_index.md"
file.create(file_path)
file_con <- file(file_path, method = "w")

text_meta <- "---
title: Home
menu: main
weight: -270
---

#### A short bite of wisdom courtesy [Daily Zen](https://www.dailyzen.com/)

"

text_to_write <- paste0(text_meta, "\n> ",quote['quote'],"\n\n","> ",quote['author'])

writeLines(file_con, text = text_to_write)
close(file_con)
}