import React, { useState, useEffect } from 'react';
import Sidebar from './DisciplineSidebar';
import { useAuth } from '../context/AuthContext'; // adjust path to where AuthContext.jsx lives
import './AllStudentsMaterialsView.css';

function getPaginationRange(currentPage, totalPages, siblingCount = 1) {
    const totalNumbers = siblingCount * 2 + 5;

    if (totalPages <= totalNumbers) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSibling = Math.max(currentPage - siblingCount, 1);
    const rightSibling = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < totalPages - 1;

    const range = [];

    range.push(1);

    if (showLeftDots) range.push('...');

    for (let i = leftSibling; i <= rightSibling; i++) {
        if (i !== 1 && i !== totalPages) range.push(i);
    }

    if (showRightDots) range.push('...');

    range.push(totalPages);

    return range;
}

function AllStudentsMaterialsView() {
    const [students, setStudents] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [selectedTerm, setSelectedTerm] = useState('Term 1');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();

    // Track which student's details are opened in the full page view (null means showing student list)
    const [selectedStudent, setSelectedStudent] = useState(null);

    // Pagination state for students list
    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 8; // 4 columns x 2 rows

    useEffect(() => {
        fetchData();
    }, [selectedTerm]);

    const fetchData = async () => {
        try {
            setLoading(true);

            // 1. Fetch master materials configuration list
            const matRes = await fetch('https://kass-checking-backend.vercel.app/api/v1/getall', {
                credentials: 'include'
            });
            if (!matRes.ok) throw new Error('Failed to fetch materials configuration');
            const matData = await matRes.json();
            setMaterials(matData);

            // 2. Fetch all students with their material checks for the given term
            const studRes = await fetch(
                `https://kass-checking-backend.vercel.app/api/v1/get-students-materials?term=${selectedTerm}`,
                { credentials: 'include' }
            );
            if (!studRes.ok) throw new Error('Failed to fetch student material records');
            const studData = await studRes.json();
            setStudents(studData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Filter students based on reg_number or Name matching the search input
    const filteredStudents = students.filter(student => {
        const studentName = (student.full_name || `${student.first_name || ''} ${student.last_name || ''}`).toLowerCase();
        const regNumber = String(student.reg_number || '').toLowerCase();
        const query = searchTerm.toLowerCase().trim();

        return studentName.includes(query) || regNumber.includes(query);
    });

    // Pagination calculations
    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
    const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const reviewerName = currentUser ? currentUser.full_name : null;

    if (loading) return <div className="asm-loading-state">Loading all student material records...</div>;
    if (error) return <div className="asm-error-state">Error: {error}</div>;

    return (
        <>
            <Sidebar />

            <div className="asm-portal-container">
                {selectedStudent ? (
                    // Detail Page View for a Single Student (4-Column Layout)
                    <div>
                        <button onClick={() => setSelectedStudent(null)} className="asm-back-btn">
                            &larr; Back to Students List
                        </button>

                        {/* Calculate Overall Summary for the selected student */}
                        {(() => {
                            let totalRequiredSum = 0;
                            let totalPresentSum = 0;
                            materials.forEach(mat => {
                                const record = selectedStudent.material_checks?.find(c => c.material_name === mat.material);
                                totalRequiredSum += Number(mat.minimum) || 0;
                                if (record && record.present_material !== undefined && record.present_material !== '') {
                                    totalPresentSum += Number(record.present_material) || 0;
                                }
                            });

                            let overallPercentage = totalRequiredSum > 0 ? Math.round((totalPresentSum / totalRequiredSum) * 100) : 0;
                            if (overallPercentage > 100) overallPercentage = 100;

                            let overallGrade = 'F';
                            let overallRating = 'Poor';
                            let overallBadgeClass = 'asm-rating-lacking';

                            if (overallPercentage >= 90) {
                                overallGrade = 'A+'; overallRating = 'Outstanding'; overallBadgeClass = 'asm-rating-complete';
                            } else if (overallPercentage >= 80) {
                                overallGrade = 'A'; overallRating = 'Excellent'; overallBadgeClass = 'asm-rating-complete';
                            } else if (overallPercentage >= 70) {
                                overallGrade = 'B'; overallRating = 'Good'; overallBadgeClass = 'asm-rating-complete';
                            } else if (overallPercentage >= 60) {
                                overallGrade = 'C'; overallRating = 'Fair'; overallBadgeClass = 'asm-rating-partial';
                            } else if (overallPercentage >= 50) {
                                overallGrade = 'D'; overallRating = 'Pass'; overallBadgeClass = 'asm-rating-partial';
                            } else {
                                overallGrade = 'F'; overallRating = 'Needs Improvement'; overallBadgeClass = 'asm-rating-lacking';
                            }

                            return (
                                <div className="asm-student-info-banner">
                                    <div>
                                        <h3>{selectedStudent.full_name || `${selectedStudent.first_name || ''} ${selectedStudent.last_name || ''}`}</h3>
                                        <p>Reg No: <strong className="asm-strong-dark">{selectedStudent.reg_number || 'N/A'}</strong></p>
                                        {reviewerName && (
                                            <p className="asm-viewed-by">Viewed by: <strong className="asm-strong-accent">{reviewerName}</strong></p>
                                        )}
                                    </div>
                                    <div className="asm-banner-right">
                                        <div>
                                            <p className="asm-term-text">Current Term: <strong className="asm-strong-accent">{selectedTerm}</strong></p>
                                        </div>
                                        <div className="asm-score-box">
                                            <div>
                                                <div className="asm-score-label">Overall Score</div>
                                                <div className="asm-score-value">{totalPresentSum} / {totalRequiredSum} ({overallPercentage}%)</div>
                                            </div>
                                            <div>
                                                <div className="asm-score-label">Overall Grade</div>
                                                <div className="asm-grade-row">
                                                    <span className="asm-grade-letter">{overallGrade}</span>
                                                    <span className={`asm-rating-badge asm-rating-badge-sm ${overallBadgeClass}`}>{overallRating}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        <h3 className="asm-breakdown-heading">Material Breakdown & Status</h3>

                        {materials.length === 0 ? (
                            <div className="asm-empty-state">No materials configured.</div>
                        ) : (
                            <div className="asm-details-grid">
                                {materials.map(mat => {
                                    const record = selectedStudent.material_checks?.find(c => c.material_name === mat.material);
                                    const presentVal = record && record.present_material !== undefined && record.present_material !== '' ? record.present_material : '-';

                                    const minRequired = Number(mat.minimum) || 1;
                                    const currentNum = presentVal !== '-' ? Number(presentVal) || 0 : 0;

                                    let percentage = Math.round((currentNum / minRequired) * 100);
                                    if (percentage > 100) percentage = 100;

                                    let grade = 'F';
                                    let ratingDesc = 'Poor';
                                    let badgeClass = 'asm-rating-lacking';
                                    let statusText = 'Pending';

                                    if (presentVal !== '-') {
                                        if (percentage >= 100) {
                                            grade = 'A';
                                            ratingDesc = 'Excellent';
                                            badgeClass = 'asm-rating-complete';
                                            statusText = 'Complete';
                                        } else if (percentage >= 75) {
                                            grade = 'B';
                                            ratingDesc = 'Good';
                                            badgeClass = 'asm-rating-complete';
                                            statusText = 'Complete';
                                        } else if (percentage >= 50) {
                                            grade = 'C';
                                            ratingDesc = 'Fair';
                                            badgeClass = 'asm-rating-partial';
                                            statusText = 'Partial';
                                        } else if (percentage >= 25) {
                                            grade = 'D';
                                            ratingDesc = 'Low';
                                            badgeClass = 'asm-rating-partial';
                                            statusText = 'Partial';
                                        } else {
                                            grade = 'E';
                                            ratingDesc = 'Very Low';
                                            badgeClass = 'asm-rating-lacking';
                                            statusText = 'Lacking';
                                        }
                                    }

                                    return (
                                        <div key={mat.id} className="asm-material-detail-card">
                                            <div>
                                                <div className="asm-material-name">{mat.material}</div>
                                                <div className="asm-material-min">Min Required: <strong className="asm-strong-slate">{mat.minimum}</strong></div>
                                            </div>
                                            <div className="asm-material-stats">
                                                <div className="asm-material-stat-row">
                                                    <span className="asm-present-text">Present: {presentVal}</span>
                                                    <span className="asm-percent-text">{presentVal !== '-' ? `${percentage}%` : '0%'}</span>
                                                </div>
                                                <div className="asm-material-stat-row">
                                                    <span className="asm-grade-text">Grade: <strong className="asm-strong-dark">{presentVal !== '-' ? grade : '-'} ({ratingDesc})</strong></span>
                                                    <span className={`asm-rating-badge ${badgeClass}`}>
                                                        {statusText}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className="asm-back-btn-wrap">
                            <button
                                onClick={() => setSelectedStudent(null)}
                                className="asm-action-btn-primary asm-action-btn-back"
                            >
                                Back to List
                            </button>
                        </div>
                    </div>
                ) : (
                    // Main Students List Page View (4-Column Grid)
                    <div>
                        <div className="asm-header-flex">
                            <h2>All Students Material Status Records</h2>

                            {reviewerName && (
                                <span className="asm-reviewer-chip">
                                    <span>👤</span> Viewing as {reviewerName}
                                </span>
                            )}

                            <div className="asm-controls-group">
                                {/* Search Input Box */}
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Search by Reg Number or Name..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="asm-search-input"
                                    />
                                </div>

                                {/* Term Selector */}
                                <div className="asm-term-select-group">
                                    <label>Term:</label>
                                    <select
                                        value={selectedTerm}
                                        onChange={(e) => setSelectedTerm(e.target.value)}
                                    >
                                        <option value="Term 1">Term 1</option>
                                        <option value="Term 2">Term 2</option>
                                        <option value="Term 3">Term 3</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="asm-cards-grid">
                            {currentStudents.length === 0 ? (
                                <div className="asm-empty-state">No matching student records found.</div>
                            ) : (
                                currentStudents.map(student => {
                                    const studentName = student.full_name || `${student.first_name || ''} ${student.last_name || ''}`.trim() || 'Unknown Student';

                                    // Calculation for overall summary status preview & percentage
                                    let totalRequiredSum = 0;
                                    let totalPresentSum = 0;
                                    materials.forEach(mat => {
                                        const record = student.material_checks?.find(c => c.material_name === mat.material);
                                        totalRequiredSum += Number(mat.minimum) || 0;
                                        if (record && record.present_material !== undefined && record.present_material !== '') {
                                            totalPresentSum += Number(record.present_material) || 0;
                                        }
                                    });

                                    let overallPercentage = totalRequiredSum > 0 ? Math.round((totalPresentSum / totalRequiredSum) * 100) : 0;
                                    if (overallPercentage > 100) overallPercentage = 100;

                                    let overallGrade = 'F';
                                    let badgeClass = 'asm-rating-lacking';
                                    let badgeText = 'Pending';

                                    if (materials.length > 0) {
                                        if (overallPercentage >= 80) {
                                            badgeClass = 'asm-rating-complete';
                                            badgeText = `Overall: A (${overallPercentage}%)`;
                                        } else if (overallPercentage >= 60) {
                                            badgeClass = 'asm-rating-complete';
                                            badgeText = `Overall: B (${overallPercentage}%)`;
                                        } else if (overallPercentage >= 40) {
                                            badgeClass = 'asm-rating-partial';
                                            badgeText = `Overall: C (${overallPercentage}%)`;
                                        } else {
                                            badgeClass = 'asm-rating-lacking';
                                            badgeText = `Overall: F (${overallPercentage}%)`;
                                        }
                                    }

                                    return (
                                        <div key={student.id || student.reg_number} className="asm-student-card">
                                            <div className="asm-student-card-info">
                                                <h4>{studentName}</h4>
                                                <p>Reg No: <span className="asm-reg-value">{student.reg_number || 'N/A'}</span></p>
                                                <div className="asm-badge-wrap">
                                                    <span className={`asm-rating-badge ${badgeClass}`}>
                                                        {badgeText}
                                                    </span>
                                                </div>
                                                {reviewerName && (
                                                    <div className="asm-reviewed-by-line">
                                                        {/* 👤 Reviewed by <strong>{reviewerName}</strong> */}
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => setSelectedStudent(student)}
                                                className="asm-action-btn-primary"
                                            >
                                                View Info Page
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="asm-pagination">
                                <button
                                    className="asm-page-btn"
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    &laquo; Prev
                                </button>

                                {getPaginationRange(currentPage, totalPages).map((page, idx) =>
                                    page === '...' ? (
                                        <span key={`dots-${idx}`} className="asm-page-ellipsis">&hellip;</span>
                                    ) : (
                                        <button
                                            key={page}
                                            className={`asm-page-btn ${currentPage === page ? 'active' : ''}`}
                                            onClick={() => paginate(page)}
                                        >
                                            {page}
                                        </button>
                                    )
                                )}

                                <button
                                    className="asm-page-btn"
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
        </>
    );
}

export default AllStudentsMaterialsView;