import React, { useEffect, useMemo, useState } from "react";
import GenerateFakeUsers from "./GenerateFakeUsers";
import { Share2 } from "lucide-react";
import { UserRound } from "lucide-react";
import { NavLink, Outlet, Routes, Route } from "react-router-dom";
import ShareBtn from "./ShareBtn";


const UsersTable = () => {

  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState({ key: "FullName", direction: "asc" });


  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 8;


  useEffect(() => {
    setUsers(GenerateFakeUsers());
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
                  u.FullName.toLowerCase().includes(q) ||
                  u.Job.toLowerCase().includes(q)
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


  const evaluate = async () =>{

    try {
      
      // alert("evaluate");
  
      const res = await fetch("http://localhost:3078/api/uploadEvaluation",{
        method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(users)
      });
  
      console.log(res);

    } catch (error) {
      console.log(error)
    }

  }

  // Main content
  return (
    <div style={{ maxWidth: 900, margin: "24px auto" }}>

      {/* Heading */}
      <h2 style={{ marginBottom: 12, textAlign: "center" }}>Candidates </h2>

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

          placeholder="Search by name or job..."
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
        <button
          onClick={() => {
            setUsers(GenerateFakeUsers());
            setQuery("");
            setSortBy({ key: "FullName", direction: "asc" });
            setPage(1);
            evaluate();
          }}
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #ccc",
            background: "white",
            cursor: "pointer",
          }}
        >
          Regenerate candidates
        </button>


        {/* Evaluation button */}
        {/* <button
          onClick={() => {evaluate()}}
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #ccc",
            background: "white",
            cursor: "pointer",
          }}
        >
          Send for evaluation
        </button> */}

        {/* Total employees */}
        <div style={{ opacity: 0.75 }}>
          Total: <b>{filteredAndSorted.length}</b>
        </div>
      </div>

      <div
        style={{
          overflowX: "auto",
          borderRadius: 12,
          border: "1px solid #eee",
        }}
      >
        {/* Table */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          {/* head section */}
          <thead>
            {/* row */}
            <tr style={{ background: "#fafafa" }}>
              <th style={thStyle} onClick={() => handleSort("id")}>
                ID <SortIcon colKey="id" />
              </th>

              <th style={thStyle} onClick={() => handleSort("FullName")}>
                Full Name <SortIcon colKey="FullName" />
              </th>

              <th style={thStyle} onClick={() => handleSort("Job")}>
                Skills <SortIcon colKey="Job" />
              </th>

              <th style={thStyle} onClick={() => handleSort("Experience")}>
                  Experience (in years) <SortIcon colKey="Experience" />
                </th>

              <th style={thStyle} onClick={() => handleSort("Gender")}>
                Gender <SortIcon colKey="Gender" />
              </th>

              <th style={thStyle} >
                Share Profile 
              </th>

              <th style={thStyle} >
                View profile 
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
              pageRows.map((u) => (
                <tr key={u.id} style={{ borderTop: "1px solid #eee" }}>
                  {/* uuid */}
                  <td
                    style={{
                      ...tdStyle,
                      fontFamily: "monospace",
                      fontSize: 12,
                    }}
                  >
                    {u.id}
                  </td>

                  {/* Fullname */}
                  <td style={tdStyle}>{u.FullName}</td>

                  {/* job */}
                  <td style={tdStyle}>{u.Job}</td>

                  {/* Experience */}
                  <td style={tdStyle}>
                    {/* <img
                      src={u.Experience}
                      alt={u.FullName}
                      width="36"
                      height="36"
                      style={{ borderRadius: "50%", objectFit: "cover" }}
                      loading="lazy"
                    /> */}
                    {u.Experience}
                  </td>

                  {/* share profile button */}
                  <td style={tdStyle}>{u.Gender}</td>

                  {/* share profile button */}
                  <td style={tdStyle}>
                    <center>
                      <ShareBtn id={u.id} fullname={u.FullName} job={u.Job} experience={u.Experience} gender={u.Gender} />
                    </center>
                  </td>

                  {/* share profile button */}
                  <td style={tdStyle}>

                    <NavLink
                      to={`/ProfileView?id=${u.id}&fullName=${u.FullName}&job=${u.Job}&experience=${u.Experience}&gender=${u.Gender}`}
                      state={{
                        id: u.id,
                        fullname: u.FullName,
                        job: u.Job,
                        experience: u.Experience,
                        gender: u.Gender,
                      }}
                    >
                      <center>
                        <UserRound className="text-blue-700 hover:bg-blue-700 hover:text-white hover:cursor-pointer hover:rounded-sm" />
                      </center>
                    </NavLink>
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

export default UsersTable;
