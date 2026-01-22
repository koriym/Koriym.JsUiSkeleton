import { useSelector, useDispatch } from 'react-redux';
import { hello } from '../store/slices/helloSlice';

const App = () => {
  const name = useSelector((state) => state.hello.name);
  const dispatch = useDispatch();

  return (
    <div>
      <h1>Hello {name}</h1>
      <button onClick={() => dispatch(hello())}>Click</button>
    </div>
  );
};

export default App;
