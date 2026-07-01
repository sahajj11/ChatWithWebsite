# ChatWithWebsite

ChatWithWebsite is a lightweight Retrieval-Augmented Generation (RAG) system that allows users to enter a website URL, crawl and index its content, and then ask questions grounded strictly in that website's data with cited sources.

---

## Features

- Crawl any website (single-site scoped)
- Semantic search using vector embeddings (Gemini)
- Chunk-based content indexing
- Chat interface with grounded responses
- Source citations back to original pages
- Supabase vector database for retrieval

---

## Example Flow

1. User enters:

   ```
   https://example.com
   ```

2. System crawls and indexes site

3. User asks:

   ```
   What services does this website offer?
   ```

4. System:
   - retrieves relevant chunks
   - generates grounded answer
   - returns response with citations
  
---


## System Architecture

```
User → URL Input → Crawler → Chunking → Embeddings → Supabase Vector DB
                                   ↓
                             Chat Query
                                   ↓
                        Semantic Retrieval (RAG)
                                   ↓
                        Gemini Response Generation
                                   ↓
                        Answer + Source Citations
```

---

## Tech Stack

- Node.js + Express (Backend)
- React (Frontend)
- Supabase (Vector database)
- Google Gemini API (Embeddings + LLM)
- Cheerio + Axios (Web crawling)

---

## Setup Instructions

### 1. Clone repository

```bash
git clone <repo-url>
cd chat-with-website
```

### 2. Install dependencies

**Backend**

```bash
cd backend
npm install
```

**Frontend**

```bash
cd frontend
npm install
```

### 3. Environment Variables

Create a `.env` file in the **backend** directory:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key

GEMINI_API_KEY=your_gemini_api_key

PORT=3000
```

### 4. Run the application

**Start backend**

```bash
cd backend
npm run dev
```

**Start frontend**

```bash
cd frontend
npm run dev
```

---

## Crawling Strategy

The system uses a **BFS-based crawler**:

- Starts from the input URL
- Extracts internal links only (same domain)
- Uses a queue to traverse pages
- Respects `robots.txt` rules
- Limits crawl using `MAX_PAGES`

**Key goals:**

- Stay within a single website
- Avoid external link leakage
- Ensure structured, bounded crawling

---

## Chunking Strategy

After crawling, page content is processed into chunks:

- Default chunk size: **1000 characters**
- Overlap: **200 characters**
- Extracts meaningful text using Cheerio (removes scripts, ads, nav, etc.)
- Ensures semantic continuity between chunks

Each chunk is stored with:

- URL
- Title
- Chunk index
- Raw text content
- Embedding vector

---

## Retrieval Approach (RAG)

When a user asks a question:

1. The query is converted into an embedding using Gemini
2. Supabase performs vector similarity search (`match_documents`)
3. Top-K relevant chunks are retrieved (typically K=5)
4. Only chunks from the selected website are used (site-scoped filtering)

This ensures:

- High semantic relevance
- Reduced noise
- Website-specific grounding

---

## Answer Generation (Grounding Strategy)

The retrieved chunks are passed to Gemini with a strict prompt:

- Model is instructed to use ONLY provided sources
- If answer is not in context → it must respond: **"Not found in the website data."**
- Responses include citations like `[1]`, `[2]`
- Each citation maps back to a specific source URL

This ensures:

- No hallucinated answers
- Full traceability to original content
- Website-grounded responses only


