import React, { useState } from "react";
import { List, Avatar, Input, Button, Card, Badge } from "antd";
import { FaPaperPlane, FaEllipsisV } from "react-icons/fa";

const { Search } = Input;

function Messages() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");

  const conversations = [
    {
      id: 1,
      name: "John Doe",
      avatar: "https://via.placeholder.com/40",
      lastMessage: "Hey, how are you doing?",
      time: "10:30 AM",
      unread: 2,
      online: true,
    },
    {
      id: 2,
      name: "Jane Smith",
      avatar: "https://via.placeholder.com/40",
      lastMessage: "The project is ready for review",
      time: "Yesterday",
      unread: 0,
      online: false,
    },
    {
      id: 3,
      name: "Mike Johnson",
      avatar: "https://via.placeholder.com/40",
      lastMessage: "Can we schedule a meeting?",
      time: "2 days ago",
      unread: 1,
      online: true,
    },
    {
      id: 4,
      name: "Sarah Wilson",
      avatar: "https://via.placeholder.com/40",
      lastMessage: "Thanks for the update!",
      time: "3 days ago",
      unread: 0,
      online: false,
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "John Doe",
      content: "Hey, how are you doing?",
      time: "10:30 AM",
      isOwn: false,
    },
    {
      id: 2,
      sender: "You",
      content: "I'm doing great! How about you?",
      time: "10:32 AM",
      isOwn: true,
    },
    {
      id: 3,
      sender: "John Doe",
      content: "Pretty good! Working on the new project.",
      time: "10:33 AM",
      isOwn: false,
    },
    {
      id: 4,
      sender: "You",
      content: "That sounds exciting! Any updates?",
      time: "10:35 AM",
      isOwn: true,
    },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // Here you would typically send the message to your backend
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <div className="content-wrapper">
      <div className="page-header">
        <h2>Messages</h2>
        <p>Chat with your team members</p>
      </div>

      <div className="content-body">
        <div className="row">
          {/* Conversations List */}
          <div className="col-md-4">
            <Card title="Conversations" extra={<FaEllipsisV />}>
              <Search
                placeholder="Search conversations..."
                allowClear
                style={{ marginBottom: 16 }}
              />
              <List
                itemLayout="horizontal"
                dataSource={conversations}
                renderItem={(item) => (
                  <List.Item
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        selectedChat?.id === item.id
                          ? "#f0f0f0"
                          : "transparent",
                      padding: "12px",
                      borderRadius: "8px",
                      marginBottom: "8px",
                    }}
                    onClick={() => setSelectedChat(item)}
                  >
                    <List.Item.Meta
                      avatar={
                        <Badge dot={item.online} offset={[-5, 5]}>
                          <Avatar src={item.avatar} />
                        </Badge>
                      }
                      title={
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span style={{ fontWeight: 500 }}>{item.name}</span>
                          <span style={{ fontSize: "12px", color: "#666" }}>
                            {item.time}
                          </span>
                        </div>
                      }
                      description={
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span style={{ color: "#666", fontSize: "13px" }}>
                            {item.lastMessage}
                          </span>
                          {item.unread > 0 && (
                            <Badge count={item.unread} size="small" />
                          )}
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </div>

          {/* Chat Area */}
          <div className="col-md-8">
            {selectedChat ? (
              <Card
                title={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Badge dot={selectedChat.online} offset={[-5, 5]}>
                      <Avatar
                        src={selectedChat.avatar}
                        style={{ marginRight: 8 }}
                      />
                    </Badge>
                    <span>{selectedChat.name}</span>
                  </div>
                }
                style={{
                  height: "600px",
                  display: "flex",
                  flexDirection: "column",
                }}
                bodyStyle={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Messages */}
                <div style={{ flex: 1, overflowY: "auto", marginBottom: 16 }}>
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      style={{
                        display: "flex",
                        justifyContent: msg.isOwn ? "flex-end" : "flex-start",
                        marginBottom: 16,
                      }}
                    >
                      <div
                        style={{
                          maxWidth: "70%",
                          padding: "12px 16px",
                          borderRadius: "18px",
                          backgroundColor: msg.isOwn ? "#1890ff" : "#f0f0f0",
                          color: msg.isOwn ? "white" : "#333",
                        }}
                      >
                        <div style={{ marginBottom: 4 }}>{msg.content}</div>
                        <div
                          style={{
                            fontSize: "11px",
                            opacity: 0.7,
                            textAlign: msg.isOwn ? "right" : "left",
                          }}
                        >
                          {msg.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onPressEnter={handleSendMessage}
                    style={{ flex: 1 }}
                  />
                  <Button
                    type="primary"
                    icon={<FaPaperPlane />}
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                  >
                    Send
                  </Button>
                </div>
              </Card>
            ) : (
              <Card
                style={{
                  height: "600px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ textAlign: "center", color: "#666" }}>
                  <h3>Select a conversation</h3>
                  <p>Choose a conversation from the list to start chatting</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messages;
