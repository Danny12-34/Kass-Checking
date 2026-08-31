import React, { useState, useEffect } from 'react';
import Sidebar from './DirectoerSidebar';
import { useAuth } from '../../context/AuthContext';


function DirAllStudentsMaterialsView() {
    const [students, setStudents] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [selectedTerm, setSelectedTerm] = useState('Term 1');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();

    const [selectedStudent, setSelectedStudent] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 8;

    useEffect(() => {
        fetchData();
    }, [selectedTerm]);

    const fetchData = async () => {
        try {
            setLoading(true);

            const matRes = await fetch('https://kass-checking-backend.vercel.app/api/v1/getall', {
                credentials: 'include'
            });
            if (!matRes.ok) throw new Error('Failed to fetch materials configuration');
            const matData = await matRes.json();
            setMaterials(matData);

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

    const getCheckedByName = (student) => {
        if (!student?.material_checks || student.material_checks.length === 0) return null;
        const withName = student.material_checks.find(c => c.checked_by_name);
        return withName ? withName.checked_by_name : null;
    };

    const filteredStudents = students.filter(student => {
        const studentName = (student.full_name || `${student.first_name || ''} ${student.last_name || ''}`).toLowerCase();
        const regNumber = String(student.reg_number || '').toLowerCase();
        const query = searchTerm.toLowerCase().trim();

        return studentName.includes(query) || regNumber.includes(query);
    });

    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
    const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Builds a compact list of page numbers with ellipses so pagination
    // stays usable on small screens even when there are many pages.
    // e.g. [1, '...', 4, 5, 6, '...', 12]
    const getPaginationRange = () => {
        const delta = 1;
        const range = [];
        const rangeWithDots = [];
        let last;

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - delta && i <= currentPage + delta)
            ) {
                range.push(i);
            }
        }

        range.forEach((i) => {
            if (last) {
                if (i - last === 2) {
                    rangeWithDots.push(last + 1);
                } else if (i - last !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            last = i;
        });

        return rangeWithDots;
    };

    const reviewerName = currentUser ? currentUser.full_name : null;

    if (loading) return <div className="loading-state">Loading all student material records...</div>;
    if (error) return <div className="error-state">Error: {error}</div>;

    return (
        <>
        <Sidebar />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

                * {
                    box-sizing: border-box;
                }
                body {
                    margin: 0;
                    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    color: #1e293b;
                }
                .portal-container {
                    padding: 35px;
                    max-width: 1320px;
                    margin: 40px auto;
                    background: #ffffff;
                    border-radius: 20px;
                    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
                    border: 1px solid rgba(226, 232, 240, 0.8);
                }
                .header-flex {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    border-bottom: 2px solid #f1f5f9;
                    padding-bottom: 20px;
                    flex-wrap: wrap;
                    gap: 20px;
                }
                .header-flex h2 {
                    margin: 0;
                    color: #0f172a;
                    font-size: 24px;
                    font-weight: 700;
                    letter-spacing: -0.02em;
                }
                .reviewer-chip {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 6px 14px;
                    border-radius: 999px;
                    background: #eef2ff;
                    border: 1px solid #c7d2fe;
                    color: #4338ca;
                    font-size: 12.5px;
                    font-weight: 600;
                    white-space: nowrap;
                }
                .reviewer-chip span {
                    color: #6366f1;
                }
                .controls-group {
                    display: flex;
                    gap: 16px;
                    align-items: center;
                    flex-wrap: wrap;
                    width: 100%;
                }
                .search-input {
                    padding: 11px 16px;
                    border-radius: 10px;
                    border: 1px solid #cbd5e1;
                    width: 270px;
                    max-width: 100%;
                    font-size: 14px;
                    outline: none;
                    background: #ffffff;
                    color: #334155;
                    transition: all 0.25s ease;
                }
                .search-input:focus {
                    border-color: #6366f1;
                    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.12);
                }
                .term-select-group {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: #f8fafc;
                    padding: 4px 12px;
                    border-radius: 10px;
                    border: 1px solid #cbd5e1;
                }
                .term-select-group label {
                    font-weight: 600;
                    color: #475569;
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    white-space: nowrap;
                }
                .term-select-group select {
                    padding: 7px 10px;
                    border-radius: 8px;
                    border: none;
                    font-size: 14px;
                    font-weight: 600;
                    background-color: transparent;
                    color: #0f172a;
                    outline: none;
                    cursor: pointer;
                }
                .cards-grid, .details-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 20px;
                    margin-bottom: 30px;
                }
                @media (max-width: 1100px) {
                    .cards-grid, .details-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                @media (max-width: 650px) {
                    .cards-grid, .details-grid {
                        grid-template-columns: 1fr;
                    }
                }
                .student-card {
                    background: linear-gradient(145deg, #ffffff 0%, #fbfcfe 100%);
                    border: 1px solid #e2e8f0;
                    border-radius: 14px;
                    padding: 22px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    gap: 18px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -2px rgba(0, 0, 0, 0.02);
                }
                .student-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 24px -4px rgba(99, 102, 241, 0.1);
                    border-color: #a5b4fc;
                }
                .student-card-info h4 {
                    margin: 0 0 6px 0;
                    color: #0f172a;
                    font-size: 17px;
                    font-weight: 700;
                    letter-spacing: -0.01em;
                    word-break: break-word;
                }
                .student-card-info p {
                    margin: 0;
                    color: #64748b;
                    font-size: 13px;
                    font-weight: 500;
                }
                .reviewed-by-line {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    margin-top: 10px;
                    font-size: 11.5px;
                    color: #94a3b8;
                    font-weight: 500;
                }
                .reviewed-by-line strong {
                    color: #475569;
                    font-weight: 600;
                }
                .action-btn-primary {
                    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
                    color: white;
                    border: none;
                    padding: 10px 16px;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 13.5px;
                    text-align: center;
                    transition: all 0.2s ease;
                    width: 100%;
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
                }
                .action-btn-primary:hover {
                    background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
                    box-shadow: 0 6px 15px rgba(99, 102, 241, 0.35);
                    transform: translateY(-1px);
                }
                .back-btn {
                    background: #f1f5f9;
                    border: 1px solid #cbd5e1;
                    color: #334155;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 25px;
                    padding: 8px 16px;
                    border-radius: 10px;
                    transition: all 0.2s ease;
                }
                .back-btn:hover {
                    background: #e2e8f0;
                    color: #0f172a;
                }
                .student-info-banner {
                    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                    padding: 24px;
                    border-radius: 14px;
                    margin-bottom: 25px;
                    border: 1px solid #cbd5e1;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 15px;
                }
                .student-info-banner h3 {
                    margin: 0 0 6px 0;
                    color: #0f172a;
                    font-size: 22px;
                    font-weight: 700;
                    word-break: break-word;
                }
                .student-info-banner p {
                    margin: 0;
                    color: #475569;
                    font-size: 14px;
                    font-weight: 500;
                }
                .banner-score-box {
                    background: #ffffff;
                    padding: 10px 16px;
                    border-radius: 10px;
                    border: 1px solid #cbd5e1;
                    display: flex;
                    gap: 15px;
                    align-items: center;
                    flex-wrap: wrap;
                }
                .material-detail-card {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 14px;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    gap: 14px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
                    transition: all 0.2s ease;
                }
                .material-detail-card:hover {
                    border-color: #cbd5e1;
                    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.04);
                }
                .rating-badge {
                    display: inline-block;
                    padding: 5px 12px;
                    border-radius: 30px;
                    font-weight: 700;
                    font-size: 11.5px;
                    letter-spacing: 0.02em;
                    text-transform: uppercase;
                    white-space: nowrap;
                }
                .rating-complete {
                    background-color: #ecfdf5;
                    color: #059669;
                    border: 1px solid #a7f3d0;
                }
                .rating-partial {
                    background-color: #fffbeb;
                    color: #d97706;
                    border: 1px solid #fde68a;
                }
                .rating-lacking {
                    background-color: #fef2f2;
                    color: #dc2626;
                    border: 1px solid #fecaca;
                }
                .pagination-wrapper {
                    width: 100%;
                    overflow-x: auto;
                    margin-top: 35px;
                    -webkit-overflow-scrolling: touch;
                    scrollbar-width: thin;
                }
                .pagination {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 8px;
                    min-width: min-content;
                    padding: 2px 4px;
                }
                .page-btn {
                    background-color: #ffffff;
                    color: #475569;
                    border: 1px solid #cbd5e1;
                    padding: 8px 14px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 13.5px;
                    transition: all 0.2s ease;
                    flex-shrink: 0;
                    white-space: nowrap;
                }
                .page-btn:hover {
                    background-color: #f8fafc;
                    border-color: #94a3b8;
                    color: #0f172a;
                }
                .page-btn.active {
                    background-color: #6366f1;
                    color: white;
                    border-color: #6366f1;
                    box-shadow: 0 4px 10px rgba(99, 102, 241, 0.25);
                }
                .page-btn:disabled {
                    background-color: #f8fafc;
                    color: #cbd5e1;
                    border-color: #e2e8f0;
                    cursor: not-allowed;
                }
                .page-ellipsis {
                    padding: 8px 2px;
                    color: #94a3b8;
                    font-weight: 700;
                    flex-shrink: 0;
                }
                .empty-state {
                    text-align: center;
                    color: #94a3b8;
                    padding: 50px;
                    font-style: italic;
                    grid-column: 1 / -1;
                    font-size: 15px;
                    font-weight: 500;
                }
                .loading-state, .error-state {
                    padding: 50px;
                    text-align: center;
                    font-size: 17px;
                    font-weight: 600;
                }
                .error-state {
                    color: #dc2626;
                }

                @media (max-width: 768px) {
                    .portal-container {
                        padding: 22px;
                        margin: 20px 12px;
                        border-radius: 16px;
                    }
                    .header-flex {
                        margin-bottom: 22px;
                        padding-bottom: 16px;
                    }
                    .header-flex h2 {
                        font-size: 20px;
                    }
                    .controls-group {
                        flex-direction: column;
                        align-items: stretch;
                        gap: 12px;
                    }
                    .search-input {
                        width: 100%;
                    }
                    .term-select-group {
                        width: 100%;
                        justify-content: space-between;
                    }
                    .student-info-banner {
                        padding: 18px;
                    }
                    .student-info-banner h3 {
                        font-size: 19px;
                    }
                    .banner-score-box {
                        width: 100%;
                        justify-content: space-between;
                    }
                }

                @media (max-width: 480px) {
                    .portal-container {
                        padding: 16px;
                        margin: 12px 8px;
                        border-radius: 14px;
                    }
                    .header-flex {
                        gap: 14px;
                    }
                    .reviewer-chip {
                        font-size: 11.5px;
                        padding: 5px 12px;
                    }
                    .student-card, .material-detail-card {
                        padding: 16px;
                    }
                    .pagination {
                        gap: 6px;
                    }
                    .page-btn {
                        padding: 7px 11px;
                        font-size: 12.5px;
                    }
                    .rating-badge {
                        font-size: 10px;
                        padding: 4px 9px;
                    }
                }
            `}</style>

            <div className="portal-container">
                {selectedStudent ? (
                    <div>
                        <button onClick={() => setSelectedStudent(null)} className="back-btn">
                            &larr; Back to Students List
                        </button>

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
                            let overallBadgeClass = 'rating-lacking';

                            if (overallPercentage >= 90) {
                                overallGrade = 'A+'; overallRating = 'Outstanding'; overallBadgeClass = 'rating-complete';
                            } else if (overallPercentage >= 80) {
                                overallGrade = 'A'; overallRating = 'Excellent'; overallBadgeClass = 'rating-complete';
                            } else if (overallPercentage >= 70) {
                                overallGrade = 'B'; overallRating = 'Good'; overallBadgeClass = 'rating-complete';
                            } else if (overallPercentage >= 60) {
                                overallGrade = 'C'; overallRating = 'Fair'; overallBadgeClass = 'rating-partial';
                            } else if (overallPercentage >= 50) {
                                overallGrade = 'D'; overallRating = 'Pass'; overallBadgeClass = 'rating-partial';
                            } else {
                                overallGrade = 'F'; overallRating = 'Needs Improvement'; overallBadgeClass = 'rating-lacking';
                            }

                            return (
                                <div className="student-info-banner">
                                    <div>
                                        <h3>{selectedStudent.full_name || `${selectedStudent.first_name || ''} ${selectedStudent.last_name || ''}`}</h3>
                                        <p>Reg No: <strong style={{ color: '#0f172a' }}>{selectedStudent.reg_number || 'N/A'}</strong></p>
                                        <p>Done by: <strong style={{ color: '#0f172a' }}>{getCheckedByName(selectedStudent) || 'N/A'}</strong></p>
                                        {reviewerName && (
                                            <p style={{ marginTop: '6px' }}>Viewed by: <strong style={{ color: '#4f46e5' }}>{reviewerName}</strong></p>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                                        <div>
                                            <p style={{ fontSize: '13.5px' }}>Current Term: <strong style={{ color: '#6366f1' }}>{selectedTerm}</strong></p>
                                        </div>
                                        <div className="banner-score-box">
                                            <div>
                                                <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Overall Score</div>
                                                <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>{totalPresentSum} / {totalRequiredSum} ({overallPercentage}%)</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Overall Grade</div>
                                                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '2px' }}>
                                                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#4f46e5' }}>{overallGrade}</span>
                                                    <span className={`rating-badge ${overallBadgeClass}`} style={{ padding: '2px 8px', fontSize: '10.5px' }}>{overallRating}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        <h3 style={{ color: '#0f172a', fontSize: '19px', fontWeight: '700', marginBottom: '20px' }}>Material Breakdown & Status</h3>

                        {materials.length === 0 ? (
                            <div className="empty-state">No materials configured.</div>
                        ) : (
                            <div className="details-grid">
                                {materials.map(mat => {
                                    const record = selectedStudent.material_checks?.find(c => c.material_name === mat.material);
                                    const presentVal = record && record.present_material !== undefined && record.present_material !== '' ? record.present_material : '-';

                                    const minRequired = Number(mat.minimum) || 1;
                                    const currentNum = presentVal !== '-' ? Number(presentVal) || 0 : 0;

                                    let percentage = Math.round((currentNum / minRequired) * 100);
                                    if (percentage > 100) percentage = 100;

                                    let grade = 'F';
                                    let ratingDesc = 'Poor';
                                    let badgeClass = 'rating-lacking';
                                    let statusText = 'Pending';

                                    if (presentVal !== '-') {
                                        if (percentage >= 100) {
                                            grade = 'A';
                                            ratingDesc = 'Excellent';
                                            badgeClass = 'rating-complete';
                                            statusText = 'Complete';
                                        } else if (percentage >= 75) {
                                            grade = 'B';
                                            ratingDesc = 'Good';
                                            badgeClass = 'rating-complete';
                                            statusText = 'Complete';
                                        } else if (percentage >= 50) {
                                            grade = 'C';
                                            ratingDesc = 'Fair';
                                            badgeClass = 'rating-partial';
                                            statusText = 'Partial';
                                        } else if (percentage >= 25) {
                                            grade = 'D';
                                            ratingDesc = 'Low';
                                            badgeClass = 'rating-partial';
                                            statusText = 'Partial';
                                        } else {
                                            grade = 'E';
                                            ratingDesc = 'Very Low';
                                            badgeClass = 'rating-lacking';
                                            statusText = 'Lacking';
                                        }
                                    }

                                    return (
                                        <div key={mat.id} className="material-detail-card">
                                            <div>
                                                <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '16px', marginBottom: '6px' }}>{mat.material}</div>
                                                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Min Required: <strong style={{ color: '#334155' }}>{mat.minimum}</strong></div>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>Present: {presentVal}</span>
                                                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#4f46e5' }}>{presentVal !== '-' ? `${percentage}%` : '0%'}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Grade: <strong style={{ color: '#0f172a' }}>{presentVal !== '-' ? grade : '-'} ({ratingDesc})</strong></span>
                                                    <span className={`rating-badge ${badgeClass}`}>
                                                        {statusText}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div style={{ marginTop: '30px' }}>
                            <button
                                onClick={() => setSelectedStudent(null)}
                                className="action-btn-primary"
                                style={{ backgroundColor: '#475569', padding: '12px 24px', fontSize: '14px', width: 'auto' }}
                            >
                                Back to List
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="header-flex">
                            <h2>All Students Material Status Records</h2>

                            {reviewerName && (
                                <span className="reviewer-chip">
                                    <span>👤</span> Viewing as {reviewerName}
                                </span>
                            )}

                            <div className="controls-group">
                                <div style={{ flex: '1 1 220px' }}>
                                    <input
                                        type="text"
                                        placeholder="Search by Reg Number or Name..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="search-input"
                                    />
                                </div>

                                <div className="term-select-group">
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

                        <div className="cards-grid">
                            {currentStudents.length === 0 ? (
                                <div className="empty-state">No matching student records found.</div>
                            ) : (
                                currentStudents.map(student => {
                                    const studentName = student.full_name || `${student.first_name || ''} ${student.last_name || ''}`.trim() || 'Unknown Student';

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

                                    let badgeClass = 'rating-lacking';
                                    let badgeText = 'Pending';

                                    if (materials.length > 0) {
                                        if (overallPercentage >= 80) {
                                            badgeClass = 'rating-complete';
                                            badgeText = `Overall: A (${overallPercentage}%)`;
                                        } else if (overallPercentage >= 60) {
                                            badgeClass = 'rating-complete';
                                            badgeText = `Overall: B (${overallPercentage}%)`;
                                        } else if (overallPercentage >= 40) {
                                            badgeClass = 'rating-partial';
                                            badgeText = `Overall: C (${overallPercentage}%)`;
                                        } else {
                                            badgeClass = 'rating-lacking';
                                            badgeText = `Overall: F (${overallPercentage}%)`;
                                        }
                                    }

                                    const checkedByName = getCheckedByName(student);

                                    return (
                                        <div key={student.id || student.reg_number} className="student-card">
                                            <div className="student-card-info">
                                                <h4>{studentName}</h4>
                                                <p>Reg No: <span style={{ color: '#334155', fontWeight: '600' }}>{student.reg_number || 'N/A'}</span></p>
                                                <div style={{ marginTop: '12px' }}>
                                                    <span className={`rating-badge ${badgeClass}`}>
                                                        {badgeText}
                                                    </span>
                                                </div>
                                                <div className="reviewed-by-line">
                                                    👤 Checked by <strong>{checkedByName || 'N/A'}</strong>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setSelectedStudent(student)}
                                                className="action-btn-primary"
                                            >
                                                View Info Page
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {totalPages > 1 && (
                            <div className="pagination-wrapper">
                                <div className="pagination">
                                    <button
                                        className="page-btn"
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        &laquo; Prev
                                    </button>

                                    {getPaginationRange().map((page, idx) =>
                                        page === '...' ? (
                                            <span key={`dots-${idx}`} className="page-ellipsis">&hellip;</span>
                                        ) : (
                                            <button
                                                key={page}
                                                className={`page-btn ${currentPage === page ? 'active' : ''}`}
                                                onClick={() => paginate(page)}
                                            >
                                                {page}
                                            </button>
                                        )
                                    )}

                                    <button
                                        className="page-btn"
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next &raquo;
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

export default DirAllStudentsMaterialsView;