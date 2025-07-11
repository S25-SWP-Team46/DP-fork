import React from "react";
import { Typography, Button } from "antd";
import { FaRegFileCode } from "react-icons/fa";
import './AllAssignments.css';

const { Title, Paragraph, Text, Link } = Typography;

class AllAssignments extends React.Component {
  constructor (props) {
    super(props)
  }

  handleAssignmentTitleClick = (assignment, isActive) => {
    console.log('Assignment clicked:', assignment, 'isActive:', isActive);
    // Здесь можно добавить логику для открытия задания
  }

  handleAssignmentFileDirectUpload = (event, assignment) => {
    const file = event.target.files[0];
    if (file) {
      console.log('File selected:', file.name, 'for assignment:', assignment.title);
      // Здесь можно добавить логику для загрузки файла
    }
  }

  render() {
    const { assignments, isActive } = this.props;
    if (assignments.length === 0) {
      return (
        <div className="classrooms">
          <Title style={{
            marginTop: 30,
            color: "#fff",
            fontSize: 45,
            fontFamily: "'Noto Sans', sans-serif",
            fontWeight: 600,
            marginBottom: 10
          }}>There are no <Text style={{
            color: "#51CB63",
            fontSize: 45,
            fontFamily: "'Noto Sans', sans-serif",
            fontWeight: 600,
            marginBottom: 10
          }}>assignments yet</Text>
          </Title>
        </div>
      );
    }

    return (
      <div className="classrooms">
        {isActive ? (
          <>
            <Title style={{
              marginTop: 30,
              color: "#51CB63",
              marginTop: 30,
              color: "#51CB63",
              fontSize: 45,
              fontFamily: "'Noto Sans', sans-serif",
              fontWeight: 600,
              marginBottom: 10
            }}>Active Assignments</Title>
          </>
        ) : (
          <>
            <Title style={{
              marginTop: 30,
              color: "#51CB63",
              marginTop: 30,
              color: "#51CB63",
              fontSize: 45,
              fontFamily: "'Noto Sans', sans-serif",
              fontWeight: 600,
              marginBottom: 10
            }}>Finished Assignments</Title>
          </>
        )}
        <div className="all-assignments">
          {assignments.map((el, idx) => (
            <div
              className="inner-assignment-card"
              key={idx}
              onClick={e => {
                if (
                  e.target.tagName === "BUTTON" ||
                  e.target.tagName === "INPUT" ||
                  e.target.closest('.all-button')
                ) {
                  return;
                }
                this.handleAssignmentTitleClick(el, true);
              }}
              style={{ cursor: "pointer" }}
            >
              <div className="assignment-header">
                <FaRegFileCode className="assignment-icon"/>
                <span className="assignment-title">{el.title}</span>
              </div>
              <div className="assignment-info-row">
                <div className="assignment-info-text">
                  <div>Open: {el.open}</div>
                  <div>Due: {el.due}</div>
                </div>
              <input
                type="file"
                style={{ display: "none" }}
                ref={ref => this[`fileInputActive${idx}`] = ref}
                onChange={e => this.handleAssignmentFileDirectUpload(e, el)}
              />
                <Button
                  className="all-button"
                  onClick={e => {
                    e.stopPropagation();
                    this[`fileInputActive${idx}`].click();
                  }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span style={{ position: "relative", top: "-1px" }}>Submit</span>
                  </span>
                </Button>
              </div>
            </div>                              
          ))}
        </div>
      </div>
    );
  }
}

export default AllAssignments;