'use client';

import LoadingSpinner from '@/components/LoadingSpinner';
import { formatDomain, getFullUrl } from '@/utils/formatDomain';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import Link from 'next/link';
import { Suspense, useEffect, useMemo, useState } from 'react';
import styles from './dashboard.module.css';

function DashboardContent() {
    const [sites, setSites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sorting, setSorting] = useState([]);

    const columnHelper = createColumnHelper();

    const columns = useMemo(
        () => [
            columnHelper.accessor('siteUrl', {
                header: 'Domain',
                cell: info => (
                    <div className={styles.domainCell}>
                        <Link
                            href={`/sites/${formatDomain(info.getValue())}`}
                            className={styles.domainLink}
                        >
                            {formatDomain(info.getValue())}
                        </Link>
                        <a
                            href={getFullUrl(info.getValue())}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.externalLink}
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                        </a>
                    </div>
                ),
            }),
            columnHelper.accessor('permissionLevel', {
                header: 'Permission Level',
                cell: info => (
                    <span className={styles.permissionBadge}>
                        {info.getValue()}
                    </span>
                ),
            }),
            columnHelper.accessor('lastModified', {
                header: 'Last Updated',
                cell: info => new Date(info.getValue() || Date.now()).toLocaleDateString(),
            }),
            columnHelper.accessor('siteUrl', {
                id: 'actions',
                header: 'Actions',
                cell: info => (
                    <button
                        className={styles.viewButton}
                        onClick={() => window.open(`https://search.google.com/search-console?resource_id=${encodeURIComponent(info.getValue())}`, '_blank')}
                    >
                        View in Search Console
                    </button>
                ),
            }),
        ],
        [columnHelper]
    );

    const table = useReactTable({
        data: sites,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    useEffect(() => {
        fetch('/api/sites')
            .then((res) => res.json())
            .then((data) => {
                setSites(data.sites || []);
                setLoading(false);
            })
            .catch((err) => {
                setError('Failed to fetch sites');
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>{error}</div>
            </div>
        );
    }

    return (
        <div>
            <div className={styles.container}>
                <h1>Your Search Console Sites</h1>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th
                                            key={header.id}
                                            onClick={header.column.getToggleSortingHandler()}
                                            className={styles.th}
                                        >
                                            <div className={styles.thContent}>
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {header.column.getCanSort() && (
                                                    <span className={styles.sortIcon}>
                                                        {{
                                                            asc: ' 🔼',
                                                            desc: ' 🔽',
                                                        }[header.column.getIsSorted()] ?? ' ⏺️'}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map(row => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className={styles.td}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* {sites.map(site => (
                <div key={site.siteUrl}>
                    <h2>{site.siteUrl}</h2>
                    <PageStatsGraph siteUrl={site.siteUrl} />
                </div>
            ))} */}
        </div>
    );
}

export default function Dashboard() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <DashboardContent />
        </Suspense>
    );
} 