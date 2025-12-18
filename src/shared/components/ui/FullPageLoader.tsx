export const FullPageLoader = () => (
  <div style={{ 
    height: "100vh", 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center",
    background: "#f3f4f6" 
  }}>
    <div className="spinner">Checking Authentication...</div>
  </div>
);