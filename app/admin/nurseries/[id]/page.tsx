'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import NurseryForm from '@/components/admin/NurseryForm'

export default function EditNurseryPage() {
  const { id } = useParams<{ id: string }>()
  const [nursery, setNursery] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/admin/nurseries/${id}`)
      .then(r => r.json())
      .then(({ nursery }) => { setNursery(nursery); setLoading(false) })
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-400 text-sm">Loading nursery...</div>
      </div>
    )
  }

  if (!nursery) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-3">😕</div>
        <div className="text-gray-500 text-sm">Nursery not found</div>
      </div>
    )
  }

  return <NurseryForm mode="edit" initialData={nursery} />
}
