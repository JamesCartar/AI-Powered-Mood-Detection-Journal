import { OpenAI, OpenAIClient, OpenAIEmbeddings } from '@langchain/openai';
import { PromptTemplate } from 'langchain/prompts';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { Document } from 'langchain/document';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { RetrievalQAChain, loadQARefineChain } from 'langchain/chains';
import z from 'zod';
import { CallbackManager } from 'langchain/callbacks';

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    sentimentScore: z
      .number()
      .describe(
        'sentiment of the text and rated on a scale from -10 to 10, where -10 is extremely negative, 0 is neutral, and 10 is extremely positive.'
      ),
    mood: z
      .string()
      .describe('the mood of the person who wrote the journal entry.'),
    summary: z.string().describe('quick summary of the entire entry.'),
    subject: z.string().describe('the subject of the journal entry.'),
    negative: z
      .boolean()
      .describe(
        'is the journal entry negative? (i.e. does it contain negative emotions?).'
      ),
    color: z
      .string()
      .regex(/^#([0-9A-Fa-f]{6})$/, 'Must be a valid 6-digit hex code.')
      .describe(
        'A valid color code (e.g., "blue"). It must represent the mood of the entry. DO NOT return words other than actuall colors.'
      ),
  })
);

function generateRandomHexColor() {
  const hexCharacters = '0123456789ABCDEF';
  let color = '#';

  for (let i = 0; i < 6; i++) {
    color += hexCharacters[Math.floor(Math.random() * 16)];
  }

  return color;
}
const getPrompt = async (entry: string) => {
  const format_instructions = parser.getFormatInstructions();

  const prompt = new PromptTemplate({
    template: `Analyze the following journal entry. 
	Follow the instructions and format your response to match the format instructions, no matter what! 
	{format_instructions}
	{entry}`,
    inputVariables: ['entry'],
    partialVariables: { format_instructions },
  });

  return prompt.format({ entry });
};

export const analyze = async (journal: string) => {
  const input = await getPrompt(journal);

  const client = new OpenAIClient({
    apiKey: 'dummy-key',
    baseURL: 'http://localhost:12434/engines/llama.cpp/v1',
  });

  console.log('Sending engineered prompt to AI model...');
  //   const response = await client.chat.completions.create({
  //     model: 'ai/llama3.2:3B-Q4_0',
  //     messages: [{ role: 'user', content: input }],
  //   });

  //   const raw = response.choices[0].message.content;
  //   console.log('AI response: ', raw);

  try {
    return {
      mood: 'happy',
      summary: 'Had a great day at the park with friends.',
      subject: 'A fun day at the park',
      negative: false,
      sentimentScore: 5.3,
      color: generateRandomHexColor(),
    };
    //   || parser.parse(raw)
  } catch (e) {
    console.error('Parsing failed:', e);
    // return raw ; // fallback to raw output
    return e; // fallback to raw output
  }
};

export const qa = async (question, entries) => {
  const docs = entries.map((entry) => {
    return new Document({
      pageContent: entry.content,
      metadata: { id: entry.id, createdAt: entry.createdAt },
    });
  });

  const client = new OpenAI({
    model: 'ai/llama3.2:3B-Q4_0',
    apiKey: 'dummy-key',
    configuration: { baseURL: 'http://localhost:12434/engines/llama.cpp/v1' },
    verbose: true,
  });

  const embeddings = new OpenAIEmbeddings({
    apiKey: 'dummy-key',
    model: 'ai/nomic-embed-text-v1.5',
    configuration: { baseURL: 'http://localhost:12434/engines/llama.cpp/v1' },
  });
  const store = await MemoryVectorStore.fromDocuments(docs, embeddings);

  const relevantDocs = await store.similaritySearch(question);

  const chain = loadQARefineChain(client);
  const res = await chain.call({ input_documents: relevantDocs, question });
  console.log(
    'final result >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>: ',
    res.output_text
  );
  return res.output_text;
};

// export const qa = async (question, entries) => {
//   const docs = entries.map((entry) => {
//     return new Document({
//       pageContent: entry.content,
//       metadata: { id: entry.id, createdAt: entry.createdAt },
//     });
//   });

//   console.log('ddddd');
//   const client = new OpenAI({
//     model: 'ai/llama3.2:3B-Q4_0',
//     temperature: 1,
//     apiKey: 'dummy-key',
//     configuration: {
//       baseURL: 'http://localhost:12434/engines/llama.cpp/v1',
//     },
//     verbose: true,
//   });

//   console.log('ccccc');
//   const embeddings = new OpenAIEmbeddings({
//     apiKey: 'dummy-key',
//     model: 'ai/nomic-embed-text-v1.5',
//     configuration: {
//       baseURL: 'http://localhost:12434/engines/llama.cpp/v1',
//     },
//   });

//   const store = await MemoryVectorStore.fromDocuments(docs, embeddings);
//   console.log('fffff', entries);
//   const relevantDocs = await store.similaritySearch(question, 1);
//   console.log('aaaaaa', relevantDocs);

//   // Callback manager with default logging enabled

//   const chain = loadQARefineChain(client, {
//     verbose: true,
//     returnIntermediateSteps: false,
//     prompt: `Read the context below and answer the question in a full sentence describing the person. Provide details from the context.
// 	Context:
// 	{context}

// 	Question: {question}

// 	Answer:`,
//   });

//   const res = await chain.call({
//     input_documents: relevantDocs,
//     question,
//   });

//   console.log(
//     'final result >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>: ',
//     res.output_text
//   );
// };
