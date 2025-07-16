
module Parser where


import Text.Megaparsec
import Text.Megaparsec.Char
import qualified Text.Megaparsec.Char.Lexer as L
import Data.Void
import Data.Char (isSpace)
import Control.Monad (void, when)
import Data.List (dropWhileEnd, find, isPrefixOf)


type Parser = Parsec Void String


data Command = ADD | DELETE | UPDATE | GET | SEARCH | DROP
    deriving (Show, Eq)
type Metadata = (String, String)
data Result = AddResult String [Metadata]
            | DeleteResult String
            | UpdateResult String String [Metadata]
            | GetResult String
            | SearchResult String Int [Metadata]
            | DropResult
    deriving (Show, Eq)

spaceConsumer :: Parser ()
spaceConsumer = L.space space1 empty empty

lexeme :: Parser a -> Parser a
lexeme = L.lexeme spaceConsumer

symbol :: String -> Parser String
symbol = L.symbol spaceConsumer

spaceReq :: Parser a -> Parser a
spaceReq p = space1 *> p

lexemeLeaveOneSpace :: Parser a -> Parser a
lexemeLeaveOneSpace p = do
    x <- p
    _ <- manyTill spaceChar (lookAhead spaceChar)
    return x


parseAllQueries :: Parser [Result]
parseAllQueries = many parseQuery <* eof

runParseAllQueries :: String -> [Result]
runParseAllQueries input =
    case runParser parseAllQueries "" input of
        Left err -> handleError err
        Right results -> results

-- Alternative function that returns error information instead of throwing
runParseAllQueriesWithError :: String -> Either (String, String) [Result]
runParseAllQueriesWithError input =
    case runParser parseAllQueries "" input of
        Left err -> Left (parseErrorParts err)
        Right results -> Right results

-- Function that returns JSON string for both success and error cases
runParseAllQueriesAsJson :: String -> String
runParseAllQueriesAsJson input =
    case runParser parseAllQueries "" input of
        Left err -> errorToJson err
        Right results -> parseMultipleToJson results


handleError :: ParseErrorBundle String Void -> [Result]
handleError err = error (errorBundlePretty err)

-- Extract unexpected and expecting parts from error message
parseErrorParts :: ParseErrorBundle String Void -> (String, String)
parseErrorParts err = 
    let errorMsg = errorBundlePretty err
        errorLines = lines errorMsg
        unexpectedPart = extractUnexpected errorLines
        expectingPart = extractExpecting errorLines
    in (unexpectedPart, expectingPart)

extractUnexpected :: [String] -> String
extractUnexpected errorLines = 
    case find ("unexpected " `isPrefixOf`) errorLines of
        Just line -> line
        Nothing -> "unknown"

extractExpecting :: [String] -> String
extractExpecting errorLines = 
    case find ("expecting " `isPrefixOf`) errorLines of
        Just line -> line
        Nothing -> "unknown"

-- Convert error to JSON format
errorToJson :: ParseErrorBundle String Void -> String
errorToJson err = 
    let (unexpected, expecting) = parseErrorParts err
    in "{\"error\":\"" ++ escapeJson unexpected ++ " -> " ++ escapeJson expecting ++ "\"}"


parseQuery :: Parser Result
parseQuery = choice
    [ parseAdd
    , parseDelete
    , parseUpdate
    , parseGet
    , parseSearch
    , parseDrop
    ]

parseAdd :: Parser Result
parseAdd = do
    _ <- string "ADD" <?> "'ADD' command"
    fileName <- spaceReq parseFileName
    metadata <- option [] (try parseMetadata)
    _ <- symbol ";" <?> "';' at the end of ADD command"
    return (AddResult fileName metadata)

parseDelete :: Parser Result
parseDelete = do
    _ <- symbol "DELETE" <?> "'DELETE' command"
    fileId <- parseFileId
    _ <- symbol ";" <?> "';' at the end of DELETE command"
    return (DeleteResult fileId)

parseUpdate :: Parser Result
parseUpdate = do
    _ <- symbol "UPDATE" <?> "'UPDATE' command"
    fileId <- parseFileId
    fileName <- spaceReq parseFileName
    metadata <- option [] (try parseMetadata)
    _ <- symbol ";" <?> "';' at the end of UPDATE command"
    return (UpdateResult fileId fileName metadata)

parseGet :: Parser Result
parseGet = do
    _ <- symbol "GET" <?> "'GET' command"
    fileId <- parseFileId
    _ <- symbol ";" <?> "';' at the end of GET command"
    return (GetResult fileId)

parseSearch :: Parser Result
parseSearch = do
    _ <- symbol "SEARCH" <?> "'SEARCH' command"
    countFiles <- parseCount
    fileName <- spaceReq parseFileName
    metadata <- option [] (try parseMetadata)
    _ <- symbol ";" <?> "';' at the end of SEARCH command"
    return (SearchResult fileName countFiles metadata)

parseDrop :: Parser Result
parseDrop = do
    _ <- symbol "DROP" <?> "'DROP' command"
    _ <- symbol ";" <?> "';' at the end of DROP command"
    return DropResult


parseFileName :: Parser String
parseFileName = lexeme $ do
    fileName <- manyTill anySingle (try (lookAhead (void (space1 *> string "metadata:"))) <|> try (lookAhead (void (char ';'))))
    return (dropWhileEnd isSpace fileName)

parseFileId :: Parser String
parseFileId = do
    _ <- symbol "->" <?> "'->' before file ID"
    prefix <- lexeme $ some alphaNumChar
    when (prefix /= "doc") $ fail "File ID must start with 'doc'"
    _ <- char '_' <?> "'_' after prefix 'doc' in file ID"
    fileId <- some digitChar
    return (prefix ++ "_" ++ fileId)

parseMetadata :: Parser [Metadata]
parseMetadata = do
    _ <- symbol "metadata:" <?> "'metadata:' keyword"
    parseMetadataList

parseMetadataList :: Parser [Metadata]
parseMetadataList = sepBy1 parseKeyValue (symbol ",")

parseKeyValue :: Parser Metadata
parseKeyValue = do
    key <- lexeme (some alphaNumChar <?> "metadata key")
    _ <- symbol "=" <?> "'=' after metadata key"
    value <- lexeme (manyTill anySingle (try (lookAhead (void (char ','))) <|> try (lookAhead (void (char ';'))))) <?> "metadata value"
    return (key, value)

parseCount :: Parser Int
parseCount = do
    _ <- symbol "->" <?> "'->' before number of files"
    countNum <- lexemeLeaveOneSpace $ some digitChar
    return (read countNum)


-- Экранирование спецсимволов для корректного вывода JSON
escapeJson :: String -> String
escapeJson = concatMap esc
  where
    esc '"' = "\\\""
    esc '\\' = "\\\\"
    esc '\n' = "\\n"
    esc '\r' = "\\r"
    esc '\t' = "\\t"
    esc c    = [c]

parseMultipleToJson :: [Result] -> String
parseMultipleToJson results =
    "[" ++ concat (intersperse "," (map resultToJson results)) ++ "]"

-- Сериализация результата парсинга в JSON-строку
resultToJson :: Result -> String
resultToJson (AddResult fileName metadata) =
    "{" ++
    "\"command\":\"ADD\"," ++
    "\"text\":\"" ++ escapeJson fileName ++ "\"," ++
    "\"metadata\": " ++ metadataListToJson metadata ++ "}"
resultToJson (DeleteResult fileId) =
    "{" ++
    "\"command\":\"DELETE\"," ++
    "\"doc_id\":\"" ++ escapeJson fileId ++ "\"}"
resultToJson (UpdateResult fileId fileName metadata) =
    "{" ++
    "\"command\":\"UPDATE\"," ++
    "\"doc_id\":\"" ++ escapeJson fileId ++ "\"," ++
    "\"text\":\"" ++ escapeJson fileName ++ "\"," ++
    "\"metadata\": " ++ metadataListToJson metadata ++ "}"
resultToJson (GetResult fileId) =
    "{" ++
    "\"command\":\"GET\"," ++
    "\"doc_id\":\"" ++ escapeJson fileId ++ "\"}"
resultToJson (SearchResult fileName count metadata) =
    "{" ++
    "\"command\":\"SEARCH\"," ++
    "\"query\":\"" ++ escapeJson fileName ++ "\"," ++
    "\"k\": " ++ show count ++ "," ++
    "\"metadata\": " ++ metadataListToJson metadata ++ "}"
resultToJson DropResult =
    "{" ++
    "\"command\":\"DROP\"" ++ "}"
    
-- Сериализация списка метаданных: если пусто — {}, иначе объект с ключами
metadataListToJson :: [Metadata] -> String
metadataListToJson [] = "{}"
metadataListToJson ms = "{" ++ (concat $ intersperse "," (map pairToJson ms)) ++ "}"


-- Сериализация одной пары метаданных (ключ:значение)
pairToJson :: Metadata -> String
pairToJson (k, v) = "\"" ++ escapeJson k ++ "\":\"" ++ escapeJson v ++ "\""



-- Вспомогательная функция для вставки разделителя между элементами списка
intersperse :: a -> [a] -> [a]
intersperse _ [] = []
intersperse _ [x] = [x]
intersperse sep (x:xs) = x : sep : intersperse sep xs

