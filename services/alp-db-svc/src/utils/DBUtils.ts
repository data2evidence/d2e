import fs from "fs";
import * as config from "./config";

export const convertColumnsToPg = (columns: string[] ): string[] => {
  return columns.map((column) => {
    return column.toLowerCase().replace(".","_")
  })
};

export const convertNameToPg = (name: string ): string => {
  return name.toLowerCase().replace(".","_")
};


export const getTableNameFromFile = (file: string, dialect: string): string => {
  const temp = file.split("/");
  // Remove the first 4 character from the file name as that is used to determine the csv sequence
  let filename = temp[temp.length - 1].slice(4).replace(".csv", "");
  if (dialect === config.DB.HANA) {
    return filename
  } else {
    return convertNameToPg(filename)
  }
};

export const getCsvFileContent = (file: string): string[] => {
  // Some csv files have \r\n and some only have \n, so replace "\r\n" to "\n" and split by "\n"
  return fs.readFileSync(file).toString().replaceAll("\r\n", "\n").split("\n");
};

export const getCsvContentHeaders = (content: string[]): string[] => {
  return content[0].split(",");
};

export const getCsvContentRows = (content: string[]): string[][] => {
  return content.slice(1).map((row) => row.split(","));
};

export const excludeColumns = (
  headers: string[],
  rows: string[][],
  columnsToExclude: Record<string, boolean>,
): Record<string, string[] | string[][]> => {
  const excludedColumnsIndex: Record<number, boolean> = {};

  const filteredHeaders = headers.filter((header: string, index: number) => {
    if (columnsToExclude[header]) {
      return false;
    }
    excludedColumnsIndex[index] = true;
    return true;
  });

  const filteredRows = rows.map((row) =>
    row.filter((_e, index) => excludedColumnsIndex[index])
  );
  return { headers: filteredHeaders, rows: filteredRows };
};

export const generateSqlTemplateForDataLoadingForHana = (
  schema: string,
  tableName: string,
  headersToLoad: string[]
): string => {
  return `INSERT INTO "${schema}"."${tableName}"
    (${headersToLoad.map((header) => `"${header}"`).join(",")}) 
    VALUES (${headersToLoad.map(() => "?").join(",")})
  `;
};

export const generateSqlTemplateForDataLoadingForPostgres = (
  schema: string,
  tableName: string,
  headersToLoad: string[],
  rowsToLoad: string[][]
): string => {
  const temp = rowsToLoad
    .map((row) =>
      row
        .map((cell) =>
          (tableName === "gdm_research_subject" && cell === "") ||
          (tableName === "gdm_questionnaire_response" && cell === "")
            ? `NULLIF ('${cell}', '')::timestamp without time zone`
            : `'${cell}'`
        )
        .join(",")
    )
    .map((row) => `(${row})`);

  return `INSERT INTO "${schema}"."${tableName}" 
    (${convertColumnsToPg(headersToLoad).map((header) => `"${header}"`).join(",")}) 
    VALUES ${temp.join(",")}
  `;
};