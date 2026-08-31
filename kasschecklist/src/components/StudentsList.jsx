import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './DisciplineSidebar'; // Import your Sidebar component
import './StudentsList.css';

export default function StudentsList() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get('https://kass-checking-backend.vercel.app/api/v1/students-list');
      setStudents(res.data || []);
    } catch (err) {
      console.error('Error fetching students list:', err);
      setError('Failed to load students directory from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await axios.delete(`https://kass-checking-backend.vercel.app/api/v1/student/${id}`);
      fetchStudents();
    } catch (err) {
      alert('Failed to delete student.');
    }
  };

  // Determine the display class dynamically from the first student record or fall back to default
  const displayClass = students.length > 0 ? (students[0].class_name || students[0].class || 'L4 ETE') : 'L4 ETE';

  // Filter students based on search input (checks registration number, full name, or class)
  const filteredStudents = students.filter(student => {
    const regNumber = (student.reg_number || '').toLowerCase();
    const fullName = (student.full_name || '').toLowerCase();
    const studentClass = (student.class_name || student.class || 'L4 ETE').toLowerCase();
    const query = searchTerm.toLowerCase();

    return regNumber.includes(query) || fullName.includes(query) || studentClass.includes(query);
  });

  // Reset to page 1 whenever search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return (
    <div className="sl-layout">
      <Sidebar />
      <div className="sl-state-container" style={{ flex: 1 }}>
        <div className="sl-spinner"></div>
        <p>Loading students directory...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="sl-layout">
      <Sidebar />
      <div className="sl-state-container sl-error-state" style={{ flex: 1 }}>
        <p>⚠️ {error}</p>
      </div>
    </div>
  );

  return (
    <div className="sl-layout">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content View */}
      <div className="sl-main-content">
        <div className="sl-students-container">
          <div className="sl-header-flex">
            <div className="sl-header-title">
              <h2>Registered Students Directory</h2>
              <p>Active Class Profile: <span className="sl-class-highlight">{displayClass}</span></p>
            </div>
            <button
              onClick={() => navigate('/CreateStudent')}
              className="sl-add-btn"
            >
              + Add New Student
            </button>
          </div>

          {/* Search Bar Section */}
          <div className="sl-search-section">
            <input
              type="text"
              placeholder="Search by student name, registration number, or class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="sl-search-input"
            />
          </div>

          <div className="sl-table-responsive">
            <table className="sl-styled-table">
              <thead>
                <tr>
                  <th className="sl-col-index">#</th>
                  <th>Registration Number</th>
                  <th>Full Name</th>
                  <th>Class</th>
                  <th className="sl-col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentStudents.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="sl-empty-state">No students found matching your search criteria.</td>
                  </tr>
                ) : (
                  currentStudents.map((student, index) => (
                    <tr key={student.id}>
                      <td className="sl-cell-index">{indexOfFirstItem + index + 1}</td>
                      <td className="sl-cell-reg">{student.reg_number}</td>
                      <td>{student.full_name}</td>
                      <td>
                        <span className="sl-badge-class">{student.class_name || student.class || 'L4 ETE'}</span>
                      </td>
                      <td>
                        <div className="sl-action-btns">
                          <button
                            onClick={() => handleDelete(student.id, student.full_name)}
                            className="sl-action-btn-delete"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {filteredStudents.length > 0 && (
            <div className="sl-pagination-footer">
              <div className="sl-pagination-info">
                Showing <strong>{indexOfFirstItem + 1}</strong> to <strong>{Math.min(indexOfLastItem, filteredStudents.length)}</strong> of <strong>{filteredStudents.length}</strong> entries
              </div>

              {totalPages > 1 && (
                <div className="sl-pagination">
                  <button
                    className="sl-page-btn"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    &laquo; Prev
                  </button>

                  {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    return (
                      <button
                        key={pageNum}
                        className={`sl-page-btn ${currentPage === pageNum ? 'active' : ''}`}
                        onClick={() => paginate(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    className="sl-page-btn"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next &raquo;
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}