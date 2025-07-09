import styles from "./TemplateList.module.css";
import { Template } from "./types";

interface TemplateListProps {
  data: Template[];
  templateChoice: Template | undefined;
  onTemplateChoiceChange: (choice: Template) => void;
}

export function TemplateList({
  data,
  templateChoice,
  onTemplateChoiceChange,
}: TemplateListProps) {
  let list = data.map((template) => {
    return (
      <li
        className={styles["template-list-item"]}
        key={template.id}
        onClick={() => {
          onTemplateChoiceChange(template);
        }}
        style={
          template.id == templateChoice?.id
            ? { backgroundColor: "#009E00" }
            : undefined
        }
      >
        <div className={styles["template-list-data"]}>
          {typeToName(template.type)}
        </div>
        <div className={styles["template-list-data"]}>{template.name}</div>
        <div className={styles["template-list-data"]}>{template.author}</div>
      </li>
    );
  });

  return (
    <>
      <div className={styles["template-list-container"]}>
        <div className={styles["template-list-title"]}>
          Choose Database Template
        </div>
        <div className={styles["template-list-header"]}>
          <div className={styles["template-list-header-col"]}>DBMS</div>
          <div className={styles["template-list-header-col"]}>
            Template Name
          </div>
          <div className={styles["template-list-header-col"]}>Author</div>
        </div>
        <ul className={styles["template-list-wrapper"]}>{list}</ul>
      </div>
    </>
  );
}

function typeToName(type: string) {
  let result = "";

  switch (type) {
    case "PSQL":
      result = "PostgreSQL";
      break;
    case "MSQL":
      result = "MySQL";
      break;
    case "MGDB":
      result = "MongoDB";
      break;
    default:
      result = "Unexpected Result";
  }

  return result;
}
