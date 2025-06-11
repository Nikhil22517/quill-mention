import React from "react";

interface MentionItemProps {
  name: string;
}

const getInitials = (name: string) => {
  const names = name.split(" ");
  return names.length > 1 ? `${names[0][0]}${names[1][0]}` : names[0][0];
};

const MentionItem: React.FC<MentionItemProps> = ({ name }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "5px",
        cursor: "pointer",
        gap: "8px",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <div
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          backgroundColor: "#007bff",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "bold",
          textTransform: "uppercase",
        }}
      >
        {getInitials(name)}
      </div>
      <span style={{ fontWeight: 500 }}>{name}</span>
    </div>
  );
};

export default MentionItem;
