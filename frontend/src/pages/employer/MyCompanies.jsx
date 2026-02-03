import { useEffect, useState } from "react";
import axiosClient from "../../services/axios-client";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function MyCompanies() {
    const { t } = useTranslation();
    const [companies, setCompanies] = useState([]);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getCompanies();
    }, [])

    const getCompanies = (url) => {
        url = url || '/employer/companies'
        setLoading(true)
        axiosClient.get(url)
            .then(({ data }) => {
                setLoading(false)
                setCompanies(data.data)
                setMeta(data.meta || {
                    current_page: data.current_page,
                    from: data.from,
                    last_page: data.last_page,
                    links: data.links,
                    path: data.path,
                    per_page: data.per_page,
                    to: data.to,
                    total: data.total
                })
            })
            .catch(() => {
                setLoading(false)
            })
    }

    const onDelete = (c) => {
        if (!window.confirm(t('companies.delete_confirm'))) {
            return
        }
        axiosClient.delete(`/companies/${c.id}`)
            .then(() => {
                getCompanies()
            })
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>{t('companies.title')}</h1>
                <Link className="btn-add" to="/companies/new">{t('companies.add_new')}</Link>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>{t('common.id')}</th>
                            <th>{t('companies.name')}</th>
                            <th>{t('companies.website')}</th>
                            <th>{t('companies.actions')}</th>
                        </tr>
                    </thead>
                    {loading &&
                        <tbody>
                            <tr>
                                <td colSpan="5" className="text-center">
                                    {t('companies.loading')}
                                </td>
                            </tr>
                        </tbody>
                    }
                    {!loading &&
                        <tbody>
                            {companies.map(c => (
                                <tr key={c.id}>
                                    <td>{c.id}</td>
                                    <td>{c.name}</td>
                                    <td>{c.website}</td>
                                    <td>
                                        <Link className="btn-edit" style={{ background: 'var(--primary-color)', color: '#0f172a' }} to={'/companies/' + c.id}>{t('companies.view')}</Link>
                                        &nbsp;
                                        <Link className="btn-edit" to={'/companies/' + c.id + '/edit'}>{t('companies.edit')}</Link>
                                        &nbsp;
                                        <button onClick={ev => onDelete(c)} className="btn-delete">{t('companies.delete')}</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    }
                </table>
                {!loading && meta.links && (
                    <div className="pagination">
                        {meta.links.map((link, index) => (
                            <button
                                key={index}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                onClick={() => getCompanies(link.url)}
                                disabled={!link.url || link.active}
                                className={"pagination-link " + (link.active ? "active" : "")}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
