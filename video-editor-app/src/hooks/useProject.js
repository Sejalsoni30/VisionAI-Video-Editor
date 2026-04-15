import { useSelector, useDispatch } from 'react-redux';
import { 
  addAsset, 
  deleteAsset, 
  // updateTimeline, <--- Ye galat tha
  updateCurrentTime, // <--- Ye sahi hai (Slice ke mutabik)
  setSelectedLayer 
} from '../store/projectSlice';

export const useProject = () => {
  const dispatch = useDispatch();
  
  const assets = useSelector((state) => state.project.assets);
  const layers = useSelector((state) => state.project.layers);
  const selectedLayerId = useSelector((state) => state.project.selectedLayerId);
  const currentTime = useSelector((state) => state.project.currentTime);

  const addNewAsset = (fileData) => dispatch(addAsset(fileData));
  const removeAsset = (id) => dispatch(deleteAsset(id));
  const selectLayer = (id) => dispatch(setSelectedLayer(id));
  
  // Yahan bhi function ka naam updateCurrentTime use karein
  const setTime = (time) => dispatch(updateCurrentTime(time));

  return {
    assets,
    layers,
    selectedLayerId,
    currentTime,
    addNewAsset,
    removeAsset,
    selectLayer,
    setTime
  };
};