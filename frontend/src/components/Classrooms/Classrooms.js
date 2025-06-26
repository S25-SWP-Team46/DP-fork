import React, { useState } from 'react';
import { Typography } from "antd";
import './Classrooms.css';
import { getClassrooms, getClassroom } from '../../api';

const { Title, Paragraph, Text, Link } = Typography;

function Classrooms() {
  const [allClassrooms, setAllClassrooms] = useState([]);
  const [singleClassroom, setSingleClassroom] = useState(null);

  const handleGetAll = async () => {
    try {
      const data = await getClassrooms();
      setAllClassrooms(data);
    } catch (e) {
      alert('Failed to fetch classrooms');
    }
  };

  const handleGetOne = async () => {
    const id = prompt('Enter classroom ID:');
    if (id) {
      try {
        const data = await getClassroom(id);
        setSingleClassroom(data);
      } catch (e) {
        alert('Failed to fetch classroom');
      }
    }
  };

  return (
    <div className="classrooms">
      <Title style={{
        color: "#fff",
        fontSize: 45,
        fontFamily: "'Noto Sans', sans-serif",
        fontWeight: 600,
        marginBottom: 10
      }}>Will be <Text style={{
        color: "#51CB63",
        fontSize: 45,
        fontFamily: "'Noto Sans', sans-serif",
        fontWeight: 600,
        marginBottom: 10
      }}>later</Text>!</Title>
      <button onClick={handleGetAll}>Show All Classrooms</button>
      <button onClick={handleGetOne}>Show One Classroom</button>
      {allClassrooms.length > 0 && (
        <div>
          <h3>All Classrooms:</h3>
          <pre>{JSON.stringify(allClassrooms, null, 2)}</pre>
        </div>
      )}
      {singleClassroom && (
        <div>
          <h3>Single Classroom:</h3>
          <pre>{JSON.stringify(singleClassroom, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default Classrooms;