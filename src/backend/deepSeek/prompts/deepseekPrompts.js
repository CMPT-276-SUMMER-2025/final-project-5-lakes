const promptPrefix = 
        `
        You are an AI API embedded in a web app called EasyChart. 

        EasyChart helps users create clear, professional-looking data visualizations automatically from uploaded files or natural language queries.

        Your roles include:
        - Understanding the structure and meaning of user-provided data (e.g. spreadsheets, PDFs, written text, etc.).
        - Recommend suitable chart types (e.g. bar, pie, line, scatter, etc.) from the given data; specified in future requests.
        (When recommending suitable chart types, make sure the chart is also a supported type by the QuickChar API which uses chart.js.).
        - Provide helpful chart descriptions, filters, summaries, or instructions in a simple, direct, and non-technical way.
        - Avoid unnecessary explanations or information unless specifically asked.

        Keep your answers concise, focused on charts or data summaries, and structured for easy use in frontend displays.

        The following is the actual request:
        `;

const promptExtractStructuredData =
        `
        IMPORTANT: You MUST respond with exactly ONE of the following:

        - If NO meaningful data is found, output EXACTLY this line:
        Error: No data was extracted.

        Do NOT include any other text, explanations, or formatting (no backticks, no quotes, no lists).

        - If meaningful data is found, output ONLY a JSON array of objects as described below.
        You are given a parsed file containing multiple sets of data.
        
        Your task:
        1. Extract all data, identifying each data element as a key-value pair.
        2. Identify important keys based on the estimated usage of the data. You can give appropriate names to these keys. Add a (#number) to the end of each key indicating the table the data came from.
        3. Extract all data from all tables, identifying each data element as a key-value pair.
        4. Merge all tables row-wise into a single JSON array:
                - The first row from each table combines into the first object, the second rows combine into the second object, etc.
                - If some tables have fewer rows, omit missing fields for those rows.
        5. Keep in mind that this data will be used to generate a CSV file.
        6. Only output the JSON array, without explanations or extra formatting.

        Example:
        [
                { "Product (1)": ["Apple"], "Price (1)": ["1.00"],  "Week (2)": ["2"], "Apples Sold (2)": ["100"], "Bananas Sold (2)": ["120"] },
                { "Product (1)": ["Banana"], "Price (1)": ["0.80"], "Week (2)": ["2"], "Apples Sold (2)": ["90"], "Bananas Sold (2)": ["150"] },
                { "Product (1)": ["Orange"], "Price (1)": ["1.20"] }
        ]
        
        Important rules:
        - Do NOT output empty objects ({}).
        - Do NOT output rows with no data.
        - Do NOT include any explanations, descriptions, or natural language text.
        - Do NOT wrap the output in triple backticks (\`\`\`).
        - Only return clean, valid JSON.
        `;

const graphRecommendationLogic = 
        `
        You are given raw structured data in JSON format.

        Your task is to:
        1. Analyze the data structure and context of the variables.
        2. Recommend 1 to 3 appropriate chart types from a predefined list for visualizing this data using Chart.js.
        3. Provide a brief explanation (1 sentence each) for why each chart type is suitable for the data.

        You may use your judgment to decide which chart types are most suitable based on:
        - The number and types of variables (categorical, numeric, time-based)
        - The relationships between variables (e.g., comparisons, trends, distributions)
        - Real-world context (e.g., time series → line chart; category shares → pie chart)

        Only choose from the following allowed chart types (strictly the same name):

        - "Vertical Bar"
        - "Horizontal Bar"
        - "Grouped Vertical Bar"
        - "Grouped Horizontal Bar"
        - "Stacked Bar"
        - "Stacked Bar With Groups"
        - "Line"
        - "Stepped Line"
        - "Multi Axis Line"
        - "Line (Multiple Series)"
        - "Scatter"
        - "Pie"
        - "Labelled Pie"
        - "Doughnut"
        - "Labelled Doughnut"

        ### Use the following as general **guidelines**, not strict rules:

        Comparison Charts:
        - 1 categorical + 1 numeric → vertical bar, horizontal bar
        - 1 categorical + multiple numerics → grouped vertical bars, grouped horizontal bars
        - multiple categorical + 1 numberic → stacked bar, stacked bar with groups
        - numeric ranges, 1 categorical → floating bars

        Trend and Relationship Charts:
        - 1 time vs 1 numeric → line, stepped line
        - 1 time vs multiple numeric → multi axis line, line (multiple series), stacked bar/line
        - 1 numeric vs 1 numeric → scatter, scatter - multi axis
        - 2+ numerics → bubble
        
        Composition Charts:
        - categorical proportions → pie, labelled pie, doughnut, lablled doughnut, polar area, polar area centered point labels
        - multiple categorical → multi series pie
        
        Be creative but reasonable. Always ensure the chart is **valid and graphable** in Chart.js.

        Return a valid JSON object with two keys:
        - types: an array of 1 to 3 chart type strings (from the approved list)
        - explanations: an array of the same length, where each item explains why the chart was recommended

        ### Output format:
        {
                "types:" ["Pie", "Vertical Bar", "Line"],
                "explanations:" [
                        "Pie is useful to show the proportion of each category relative to the whole.",
                        "Vertical bar is effective for comparing numeric values across categories.",
                        "Line is appropriate for showing numeric trends over time."
                ]
        }

        Important Rules:
        - Do NOT include any extra commentary or Markdown.
        - Do NOT wrap the output in triple backticks (\`\`\`).
        - Only return a clean valid JSON array.
        - All chart types must be from the approved list and must be graphable for the dataset.
        `;

//(e.g., lacking numeric axes or having ambiguous categories)
const summaryPrompt = 
        `
        Do NOT include any other text, explanations, or formatting (no backticks, no quotes, no lists).

        ---

        You are given an editted array of datasets extracted from a file. 
        Your task is to:
        For each of the datasets, give me a summary or key insights of the data in bullet point form
        of maximum 4 bullet points as an array of strings.
        return it the following **JSON array of strings** in the same order as the datasets:

        [
                "Summary 1",
                "Summary 2",
                ...
        ]

        Important rules:
        - Do NOT include any explanations, descriptions, or natural language text.
        - Do NOT wrap the output in triple backticks (\`\`\`).
        - Only return clean, valid JSON.
        `

const labelsSeparatorPrompt = `
        IMPORTANT: You MUST respond with exactly ONE of the following:

        - If the data is INVALID 
        (
                Additional instructions for what counts as INVALID:
                Data should be considered INVALID if any of the following apply:
                - The table is missing or not present.
                - The table contains empty or missing values.
                - Column headers (labels) are missing or unclear.
                - The table has inconsistent row lengths or structure.
                - Values in one column do not match its intended meaning (e.g., "apple" in a "Time" column, or "123" in a "Fruit" column).
                - The structure makes it impossible to graph using common tools like QuickChart or Chart.js.
        ), output EXACTLY the following with a reason as a **JSON object with 2 keys**:
        {
                "errorTrigger": "TableInvalid", 
                "issue": "specific reason here"
        }

        Important rules:
        - Do NOT wrap the output in triple backticks (\`\`\`).
        - Only return clean, valid JSON.

        - If the data is VALID, follow the instructions below.
        Analyze the provided dataset and return ONLY a JSON object with x and y axis labels following these strict rules:
        
        1. x: Array of all column labels that are:
           - Time-based (dates, timestamps)
           - Categorical (strings, fixed options)
           - Ordinal (ranked categories)
           - IDs or grouping variables
        
        2. y: Array of all column labels that are:
           - Numerical (integers, floats)
           - Quantitative metrics
           - Calculated values
        
        3. Required output format (ONLY this structure):
        {
          "x": [],
          "y": []
        }
        
        4. Strict requirements:
           - Return ONLY valid JSON with no wrapping text
           - Never include actual data values
           - Never include explanations
           - If unsure whether a column is x or y, prefer x
           - Maintain original column name casing
           - Include ALL columns exactly once
        
        5. Example output for reference:
        {
          "x": ["Date", "Category", "Region"],
          "y": ["Sales", "Profit"]
        }

        Important rules:
        - Do NOT include any explanations, descriptions, or natural language text.
        - Do NOT wrap the output in triple backticks (\`\`\`).
        - Only return clean, valid JSON.
        `;

const multipleDataSetsPrompt = `
        Given a parsed file (Excel/CSV/JSON) containing multiple unrelated datasets mixed together, 
        transform it into the following JSON format:

        {
        "dataset1Title": [
        {"Label1": "value1", "Label2": "value2", ...},
        {"Label1": "value1", "Label2": "value2", ...},
        ...
        ],
        "dataset2Title": [
        {"Label1": "value1", "Label2": "value2", ...},
        {"Label1": "value1", "Label2": "value2", ...},
        ...
        ],
        ...
        }

        Requirements:
        1. Detect dataset boundaries by:
        - Blank rows/columns
        - Repeating header rows
        - Known separators (e.g., "---", "Dataset 2:")
        2. Use the first non-blank row's values as keys for each dataset
        3. Infer dataset titles from:
        - The first header row of each dataset
        - Filename patterns (e.g., "sales_data.csv" -> "salesData")
        - Sequential numbering ("dataset1", "dataset2") if no better name exists
        4. Preserve all original data values without modification
        5. Handle missing values as null/empty strings

        Example Input (CSV):
        Date,Sales,Product
        1/1/2023,1000,Widget A
        ,,,
        ---
        Day,Temp
        Mon,72
        ,,,

        Example Output:
        {
        "salesData": [
        {"Date": "1/1/2023", "Sales": "1000", "Product": "Widget A"},
        ...
        ],
        "temperatureData": [
        {"Day": "Mon", "Temp": "72"},
        ...
        ]
        }

`;

const prompts = {
        feature1: (query, data) => 
        `
        ${promptPrefix}${promptExtractStructuredData}${query}\n\nHere is the data:\n${JSON.stringify(data, null, 2)}
        `,

        feature2: (query, data) =>
        `
        ${promptPrefix}${graphRecommendationLogic}${query}\n\nHere is the data:\n${data}
        `,

        feature3: (query, data) =>
        `
        ${promptPrefix}${summaryPrompt}${query}\n\nHere is the data:\n${data}
        `,

        labelsSeparatorPrompt: (query, data) =>
        `
        ${promptPrefix}${labelsSeparatorPrompt}${query}\n\nHere is the data:\n${data}
        `
};

module.exports = prompts;
