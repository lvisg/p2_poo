import { useMemo } from 'react'
import { useEffect, useState } from 'react'
import { resumoPorEstado } from '../api/vacinacaoApi'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

function GraficoResumo() {
    const [dados, setDados] = useState([])
    const [carregando, setCarregando] = useState(false)

    useEffect(() => {
        async function carregar() {
            try {
                setCarregando(true)
                const resumo = await resumoPorEstado()

                const formatado = Object.entries(resumo).map(([uf, total]) => ({ uf, total }))
                setDados(formatado)
            } catch (e) {
                setDados([])
            } finally {
                setCarregando(false)
            }
        }
        carregar()
    }, [])

    if (carregando) return <section className="painel"><p>Carregando gráfico...</p></section>
    if (dados.length === 0) return null

    return (
        <section className="painel">
            <h2>Vacinações por UF</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dados} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="uf" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </section>
    )
}

export default GraficoResumo