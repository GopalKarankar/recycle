import React, { useEffect, useMemo, useState } from "react";
import GenerateFakeUsers from "./GenerateFakeUsers";
import { Share2 } from "lucide-react";
import { UserRound } from "lucide-react";

const Leaderboard = () => {

  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState({ key: "rank", direction: "asc" });


  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

    
  const loadLeaderboard = async () =>{
      // alert("ranking");

    try {
        
      const res = await fetch("http://localhost:3078/api/loadLeaderboard");

      const [data] = await res.json();
  
      // console.log(data);
 
      setUsers(data);

    } catch (error) {
      console.log(error)
    }

  }



  useEffect(() => {
      loadLeaderboard();
  }, []);

  // console.log(users)

  // hsndling sort
  const handleSort = (key) => {

    setPage(1);

    setSortBy((prev) => {
      const direction =
        prev.key === key && prev.direction === "asc" ? "desc" : "asc";
      return { key, direction };
    });

  };


  // Filter and sort
  const filteredAndSorted = useMemo(() => {
    const q = query.trim().toLowerCase();

          // 1) filter
          const filtered = !q
            ? users
            : users.filter((u) => {
                return (
                  String(u?.rank_position).toLowerCase().includes(q) ||
                  u.candidate_id.toLowerCase().includes(q) 
                );
              });

          // 2) sort
          const { key, direction } = sortBy;
          const sorted = [...filtered].sort((a, b) => {
            const av = String(a[key] ?? "").toLowerCase();
            const bv = String(b[key] ?? "").toLowerCase();
            if (av < bv) return direction === "asc" ? -1 : 1;
            if (av > bv) return direction === "asc" ? 1 : -1;
            return 0;
          });

    return sorted;

  }, [users, query, sortBy]);

  // Total pages
  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / pageSize));
  
  const safePage = Math.min(page, totalPages);

  // Page rows
  const pageRows = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredAndSorted.slice(start, start + pageSize);
  }, [filteredAndSorted, safePage]);

  // SortIcon
  const SortIcon = ({ colKey }) => {
    if (sortBy.key !== colKey) return <span style={{ opacity: 0.35 }}>↕</span>;
    return sortBy.direction === "asc" ? (
      <span>↑</span>
    ) : (
      <span>↓</span>
    );
  };


  // Main content
  return (
    <div style={{ maxWidth: 900, margin: "24px auto"}}>
      
      {/* Heading */}
      <h2 style={{ marginBottom: 12, textAlign:"center" }}>Leaderboard (Top 10 candidates)</h2>

      {/* Search field */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 12,
          flexWrap: "wrap",
        }}
      >
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Search by  candidate Id or Rank position"
          style={{
            flex: 1,
            minWidth: 220,
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #ccc",
            outline: "none",
          }}
        />


          {/* Total employees */}
        <div style={{ opacity: 0.75 }}>
          Total: <b>{filteredAndSorted.length}</b>
        </div>

      </div>


      <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid #eee" }}>
          
          {/* Table */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          
          {/* head section */}
          <thead>
          
            {/* row */}
            <tr style={{ background: "#fafafa" }}>
            
              <th style={thStyle} >
                Id 
              </th>

              <th style={thStyle} onClick={() => handleSort("candidate_id")}>
                candidate_id  <SortIcon colKey="candidate_id" />
              </th>
                  
            
              <th style={thStyle} onClick={() => handleSort("total_score")}>
                total_score   <SortIcon colKey="total_score" />
              </th>
            
            
              <th style={thStyle} onClick={() => handleSort("rank")}>
                Rank position   <SortIcon colKey="rank" />
              </th>
            
            </tr>
          </thead>


          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                {/* No result found */}
                <td colSpan={4} style={{ padding: 16, textAlign: "center" }}>
                  No results found.
                </td>
              </tr>
            ) : (
              pageRows.map((u, key) => (
                <tr key={key} style={{ borderTop: "1px solid #eee" }}>

                  {/* id */}
                  <td style={tdStyle}>{key+1}</td>


                  {/* candidate_id */}
                  <td style={tdStyle}>{u.candidate_id}</td>

                  {/* total_score */}
                  <td style={tdStyle}>{u.total_score}</td>

                  {/* rank_position */}
                  <td style={tdStyle}  >
                    {u.rank_position}
                  </td>


                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 12,
          gap: 12,
          flexWrap: "wrap",
        }}
      >

        {/* page no. */}
        <div style={{ opacity: 0.75 }}>
          Page <b>{safePage}</b> / <b>{totalPages}</b>
        </div>


        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        
          {/* Prev button */}
          <button
            disabled={safePage === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            style={btnStyle(safePage === 1)}
          >
            Prev
          </button>

          {/* Next button */}
          <button
            disabled={safePage === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            style={btnStyle(safePage === totalPages)}
          >
            Next
          </button>

        </div>
        
      </div>
    </div>
  );
};

const thStyle = {
  textAlign: "center",
  padding: "12px 12px",
  cursor: "pointer",
  userSelect: "none",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "12px 12px",
  whiteSpace: "nowrap",
  textAlign:"center"
};

const btnStyle = (disabled) => ({
  padding: "8px 12px",
  borderRadius: 10,
  border: "1px solid #ccc",
  background: "white",
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.6 : 1,
});

export default Leaderboard;
