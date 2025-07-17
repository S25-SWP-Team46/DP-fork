import React from "react"
import './Articles.css';
import { Modal, Typography } from "antd";

const { Title } = Typography;

class Articles extends React.Component {
  render() {
    const { open, onCancel, article } = this.props;
    if (!article) return null; // <-- Prevents error if article is undefined
    return (
      <Modal 
        className="article-modal" 
        open={open} 
        onCancel={onCancel} 
        footer={null}
        width={800}
      >
        <Title className="inner-article-title">{article.title}</Title>
        
        <div className="inner-article-author">
          {article.authors && article.authors.length > 0
            ? article.authors.map((author, idx) =>
              <span key={author.id || idx}>
                {author.user_name || author.name || author}
                {idx < article.authors.length - 1 ? ', ' : ''}
              </span>
            )
          : "No authors"}
        </div>
        <div className="inner-article-decription">
            {article.description}
        </div>
      </Modal>
    );
  }
}

export default Articles;