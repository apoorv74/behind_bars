---
date: 2026-02-19
title: LLM-Friendly PDF Parsing
authors: ["apoorv"]
categories:
  - pdf
  - llm
  - claude
  - docling
toc: false
slug: pdf-processing-llm
---

Working with pdf files has evolved over the last few years. The new LLM-based workflows have made it easier than ever to parse tables from PDF files without compromising on the accuracy of the data points. I had to parse the tables from this [report on Population Projections](https://mohfw.gov.in/sites/default/files/Population%20Projection%20Report%202011-2036%20-%20upload_compressed_0.pdf) published by the National Commission On Population, Ministry Of Health & Family Welfare. There are 21 different table types here, but the actual number of tables is much higher — most types have separate state-level variants. Some tables are divided in two parts on the same page. A year ago, I would have used a UI based tool like [Tabula](https://tabula.technology/) or a python library like [Camelot](https://camelot-py.readthedocs.io/en/master/) to extract tables from this PDF.

But now what is left of this task (for most use-cases) is to feed this pdf report into any LLM and write a good prompt. One issue I see with this approach is the over-consumption of LLM tokens. Such tasks consume tokens rapidly. A task like this can exhaust the tokens available for a [Claude Code pro](https://claude.com/pricing) session. 

This is a good use-case for [Docling](https://github.com/docling-project/docling). An open-source document processing library designed to turn messy, real-world documents into clean, structured data. Docling is powered by [DocLayNet](https://github.com/DS4SD/DocLayNet): _A Large Human-Annotated Dataset for Document-Layout Analysis_ and [TableFormer](https://arxiv.org/abs/2203.00274) -  _A family of transformer-based models specialized for accurate table structure recovery and table-text reasoning._

So instead of attaching the PDF directly to an LLM, I first passed it to Docling, which runs **locally**. It offers a few [customisations](https://docling-project.github.io/docling/reference/pipeline_options/#docling.datamodel.pipeline_options.PdfPipelineOptions). The script included inputs related to specific page ranges, OCR mode (turned it off since this was not a scanned document), and other small fixes to ensure the tables and headings were correctly identified. Docling will first convert the document to a [DoclingDocument](https://docling-project.github.io/docling/reference/docling_document/#docling_core.types.doc.DoclingDocument) and then extracts text in the specified format. By the end of this step, I had one csv per table. In the next few prompts, I was able to create a consolidated csv file in the desired format and conduct a few data validation checks.

The pdf processing pipeline looks like this:

![pdf processing flowchart](/images/pdf-processing-flowchart.png)

I managed to complete this task within the prescribed session token limits for Claude Code Pro plan. A few other things that helped:

1. Heavy usage of the `/clear` command
2. A [minimal CLAUDE.md](https://code.claude.com/docs/en/costs#move-instructions-from-claude-md-to-skills) file. 
3. [Disabling MCP tools](https://code.claude.com/docs/en/costs#reduce-mcp-server-overhead)

This [claude code doc](https://code.claude.com/docs/en/costs#reduce-token-usage) has a few more tips to reduce token usage. 