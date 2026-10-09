import { useEffect, useState } from "react"
import type { CategoryDto, ReorderCategoryDto } from "../types"
import api from "../api/axios";
import { Link } from "react-router-dom";
import { AlertCircle, GripVertical, Loader2, Plus, Store } from "lucide-react";
import '../styles/CategoriesList.css';
import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";
import { CategoryTableSkeleton } from "./CategoryTableSkeleton";
import toast from "react-hot-toast";


export const CategoriesList: React.FC = () => {
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [isReordering, setIsReordering] = useState<boolean>(false);

    const getCategories = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await api.get<CategoryDto[]>('admin/categories');
            setCategories(response.data);


        } catch (err: any) {
            console.error('Greška pri učitavanju kategorija:', err);
            setError('Neuspješno učitavanje liste kategorija sa servera.');

        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getCategories();
    }, []);

    const deleteCategory = async (id: string) => {
        if (!window.confirm('Da li ste sigurni da želite obrisati ovu kategoriju?')) return;
        try {
            setDeleteError(null)
            await api.delete(`admin/categories/${id}`);
            toast.success('Kategorija obrisana.');

            setCategories((previousC) => previousC.filter((c) => c.id !== id));
        } catch (err: any) {
            console.error('Greška pri brisanju kategorije:', err);
            setDeleteError('Neuspješno brisanje kategorije.');
            toast.error('Kategorija nije obrisana.');
        }




    }
    const handleOnDragEnd = async (result: DropResult) => {
        if (!result.destination) return;

        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;

        if (sourceIndex === destinationIndex) return;

        
        const reorder = (
            list: CategoryDto[],
            startIndex: number,
            endIndex: number
        ): CategoryDto[] => {
            const res = Array.from(list);
            const [removed] = res.splice(startIndex, 1);
            res.splice(endIndex, 0, removed);

            return res.map((item, index) => ({
                ...item,
                displayOrder: index + 1,
            }));
        };

        
        const reorderedCategories = reorder(categories, sourceIndex, destinationIndex);

        
        setCategories(reorderedCategories);

        
        try {
            setIsReordering(true);
            const payload: ReorderCategoryDto[] = reorderedCategories.map((c) => ({
                id: c.id,
                displayOrder: c.displayOrder,
            }));

            await api.put('admin/categories/reorder', payload);
        } catch (err) {
            console.error('Greška pri spašavanju novog redoslijeda:', err);
            
            getCategories();
        } finally {
            setIsReordering(false);
        }
    };





    return (
    <div className="categories-container">
        <div className="categories-header">
            <div>
                <h2 className="page-title">Kategorije</h2>
                <p className="page-subtitle">Pregled i upravljanje kategorijama.</p>
            </div>

            <div>
                <Link to="/admin/categories/new" className="add-button">
                    <Plus />
                    Nova kategorija
                </Link>
            </div>
        </div>

        {deleteError && (
            <div className="state-container" style={{ color: '#dc2626' }}>
                <AlertCircle size={32} />
                <p>{deleteError}</p>
            </div>
        )}

        <div className="table-card">
            {isLoading ? (
                <div className="state-container">
                    <CategoryTableSkeleton />
                </div>
            ) : error ? (
                <div className="state-container" style={{ color: '#dc2626' }}>
                    <AlertCircle size={32} />
                    <p>{error}</p>
                    <button
                        onClick={getCategories}
                        style={{
                            marginTop: '0.5rem',
                            padding: '0.7rem 1rem',
                            borderRadius: '15px',
                            border: '1px solid #cbd5e1',
                            cursor: 'pointer',
                        }}
                    >
                        Pokušaj ponovo
                    </button>
                </div>
            ) : categories.length === 0 ? (
                <div className="state-container">
                    <Store size={40} style={{ color: '#94a3b8' }} />
                    <p>Trenutno nema registrovanih kategorija u sistemu.</p>
                </div>
            ) : (
                
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    
                    <Droppable droppableId="categories-droppable">
                        {(provided) => (
                            <div 
                                className="categiries-table"
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                <table>
                                    <thead>
                                        <tr>
                                            <th style={{ width: '40px' }}></th> 
                                            <th>ID</th>
                                            <th>Naziv kategorije</th>
                                            <th>Red prikaza</th>
                                            <th>Uredi</th>
                                            <th>Obriši</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map((c, index) => (
                                            
                                            <Draggable key={c.id} draggableId={c.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <tr
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        style={{
                                                            ...provided.draggableProps.style,
                                                            
                                                            backgroundColor: snapshot.isDragging ? '#f1f5f9' : 'transparent'
                                                        }}
                                                    >
                                                        
                                                        <td {...provided.dragHandleProps} style={{ cursor: 'grab', textAlign: 'center' }}>
                                                            <GripVertical size={18} color="#94a3b8" />
                                                        </td>
                                                        <td>{c.id}</td>
                                                        <td>{c.name}</td>
                                                        <td>{c.displayOrder}</td>
                                                        <td>
                                                            <Link to={`/admin/categories/edit/${c.id}`} className="uredi-btn">
                                                                Uredi
                                                            </Link>
                                                        </td>
                                                        <td>
                                                            <button onClick={() => deleteCategory(c.id)} className="delete">
                                                                Obriši
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder} 
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            )}
        </div>
    </div>
);


}


