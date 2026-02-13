import React, { useEffect, useMemo, useState } from "react";
import GenerateFakeUsers from "./GenerateFakeUsers";
import { Share2 } from "lucide-react";
import { UserRound } from "lucide-react";

const EvaluationTable = () => {

  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState({ key: "", direction: "asc" });


  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const fetchEvaluations = async () =>{
    try {
      
      const res = await fetch("http://localhost:3078/api/evaluation")

      const [data] = await res.json();

      setUsers(data);
      // console.log(data);
      
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {

    fetchEvaluations();
    // setUsers(GenerateFakeUsers());
    // setUsers([]);
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

const filteredAndSorted = useMemo(() => {

      const q = query.trim().toLowerCase();

      // 1) filter by candidate_id OR evaluation id
      const filtered = !q
        ? users
        : users.filter((u) => {
        const evalId = String(u?.id ?? "").toLowerCase();              // evaluation id
        const candidateId = String(u?.candidate_id ?? "").toLowerCase(); // candidate id

        return evalId.includes(q) || candidateId.includes(q);
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
      <h2 style={{ marginBottom: 12, textAlign:"center" }}>Evaluations</h2>

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
          
          placeholder="Search by Candidate Id or Evaluation Id..."
          style={{
            flex: 1,
            minWidth: 220,
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #ccc",
            outline: "none",
          }}
        />


          {/* Regenerate button */}
        {/* <button
          onClick={() => {}}
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #ccc",
            background: "white",
            cursor: "pointer",
          }}
        >
          Send for ranking
        </button> */}

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
            
              <th style={thStyle} onClick={() => handleSort("id")}>
                Evaluation ID <SortIcon colKey="id" />
              </th>
            
              <th style={thStyle} onClick={() => handleSort("candidate_id")}>
                Candidate ID <SortIcon colKey="candidate_id" />
              </th>

              <th style={thStyle} onClick={() => handleSort("crisis_score")}>
                 crisis_score <SortIcon colKey="crisis_score" />
              </th>
            
              <th style={thStyle} onClick={() => handleSort("sustainability_score")}>
                sustainability_score <SortIcon colKey="sustainability_score" />
              </th>

              <th style={thStyle} onClick={() => handleSort("team_motivation_score")}>
                team_motivation_score  <SortIcon colKey="team_motivation_score" />
              </th>
            
              <th style={thStyle} onClick={() => handleSort("total_score")}>
                Average_total_score   <SortIcon colKey="total_score" />
              </th>

              <th style={thStyle} onClick={() => handleSort("evaluated_at")}>
                evaluated_at   <SortIcon colKey="evaluated_at" />
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

                  {/* Evaluation id */}
                  <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 12 }}>
                    {u.id}
                  </td>

                  {/* candidate_id */}
                  <td style={tdStyle}>{u.candidate_id}</td>

                  {/* crisis_score */}
                  <td style={tdStyle}>{u.crisis_score}</td>

                  {/* sustainability_score */}
                  <td style={tdStyle}>{u.sustainability_score}</td>

                  {/* team_motivation_score */}
                  <td style={tdStyle}>{u.team_motivation_score}</td>

                  {/* total_score */}
                  <td style={tdStyle}>{u.total_score}</td>

                  {/* created_at */}
                  <td style={tdStyle}>{u.created_at}</td>


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

export default EvaluationTable;
