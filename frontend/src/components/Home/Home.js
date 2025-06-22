import React from "react";
import { Typography, Button } from "antd";
import "./Home.css";
import { SiSqlite } from "react-icons/si";
import { BiLogoPostgresql } from "react-icons/bi";
import { SiMongodb } from "react-icons/si";
import { FaDatabase } from "react-icons/fa";
import MyModal from "../LayOut/Header/modal";
import { MdAccountCircle } from "react-icons/md";
import { FaCode } from "react-icons/fa";
import { FaBook } from "react-icons/fa";


const { Title, Paragraph, Text } = Typography;

class Home extends React.Component {
  render() {
    return (
      <div className="home">
        <Title style={{
          color: "#fff",
          fontSize: 25,
          fontFamily: "'Noto Sans', sans-serif",
          fontWeight: 400,
          marginBottom: 40,
          marginLeft: 45
        }}><span style={{ color: "#51CB63" }}>Database</span> Playground</Title>

        <div className="icon-row" style={{ marginTop: 70 }}>
          <div className="iconText">
            <SiSqlite className="icon" size={130} />
            <div className="text-container">
              <p className="title">SQLite</p>
              <Text className="description">
                SQLite is an in-process library that implements a self-contained,
                serverless, zero-configuration, transactional SQL database engine.
              </Text>
            </div>
          </div>

          <div className="iconText">
            <SiMongodb className="icon" size={130} />
            <div className="text-container">
              <p className="title">MongoBD</p>
              <Text className="description">
                MongoDB is a popular, open-source NoSQL database that stores
                data in flexible, JSON-like documents
              </Text>
            </div>
          </div>
        </div>

        <div className="icon-row">
          <div className="iconText">
            <BiLogoPostgresql className="icon" size={130} />
            <div className="text-container">
              <p className="title">PostgreSQL</p>
              <Text className="description">
                PostgreSQL is a powerful, open source object-relational database
                system with a strong reputation for reliability, feature robustness, and performance.
              </Text>
            </div>
          </div>

          <div className="iconText">
            <FaDatabase className="icon" size={130} />
            <div className="text-container">
              <p className="title">Chroma</p>
              <Text className="description">
                Chroma or ChromaDB is an open-source vector database tailored
                to applications with large language models
              </Text>
            </div>
          </div>
        </div>

        <div className="start">
          <Paragraph className="home-text">
            No setup, no installation. <br />
            Just write queries and explore!
          </Paragraph>

          <span className="button-row">
            {!this.props.isLogin ?
              <Button variant="solid" className="myButton" onClick={() => this.props.handleButtonClick("signin")}><span style={{ position: "relative", top: "-1px" }}>Sign In</span></Button> :
              <Button
                variant="solid"
                className="myButton"
                onClick={() => this.props.handleButtonClick("acc")}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span style={{ position: "relative", top: "-1px" }}>Account</span> <MdAccountCircle />
                </span>
              </Button>}
            <MyModal open={this.props.isModalOpen} logIn={this.props.logIn} setPage={this.props.setPage} onCancel={this.props.handleCancel} updateLogIn={this.props.updateLogIn} setCookie={this.props.setCookie} footer={null} setUser={this.props.setUser} title="Sing In" />

            <Button className="myButton" onClick={() => this.props.handleButtonClick("classrooms")}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ position: "relative", top: "-1px" }}>Classrooms </span> <FaBook/>
              </span>
            </Button>

            <Button className="myButton" onClick={() => this.props.handleButtonClick("template")}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ position: "relative", top: "-1px" }}>Template </span> <FaCode/>
              </span>
            </Button>
          </span>
        </div>

      </div>
    );
  }
}

export default Home;