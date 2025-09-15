# Pokémon Pokédex (Web Crawling Project)

> Developed by Jayden Jang for a course assignment.  
> Starting from provided starter files, I independently implemented all crawling, data processing, database design, and interface features.

## Project Overview
This project builds a **Pokémon Pokédex** by crawling online Pokémon databases, collecting structured data (e.g., name, type, abilities, stats, and evolutions), and displaying them through a searchable web application.  

It was originally a course assignment, but I implemented all components myself — from crawling logic to database schema design and interactive frontend.

---

## Features
- **Web Crawling**: Collected data from Pokémon sites using `requests` + `BeautifulSoup`  
- **Data Cleaning & Storage**: Normalized raw HTML into CSV/SQLite for consistent queries  
- **Pokédex Interface** (Flask web app):  
  - Search Pokémon by name or ID  
  - Filter by type (Fire, Water, Psychic, etc.)  
  - Display base stats (HP, Attack, Defense, Speed, etc.) and evolution lines  
- **Full-stack Integration**: Connected crawler → database → backend → frontend  

---

## My Role
Since this was an individual assignment, I completed every part of the project:  
- Implemented the **crawler logic** with error handling and rate limiting  
- Designed the **database schema** (Pokémon table, Type mapping, Evolution table)  
- Built the **Flask backend** for searching, filtering, and displaying results  
- Designed the **UI templates**, integrating data dynamically  
- Debugged issues with missing/duplicate data and irregular HTML structures  

---

## Lessons Learned
- Learned how to transform **unstructured web data** into a reliable database  
- Strengthened understanding of **database design** to support complex queries (multi-types, evolutions)  
- Improved debugging skills by handling real-world data inconsistencies  
- Experienced the full cycle: from raw data crawling → processing → database → frontend delivery  
