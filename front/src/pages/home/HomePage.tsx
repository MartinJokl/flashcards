import { useSearchParams } from "react-router";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { normalAxios } from "../../axiosInstance";

type Set = {
  name: string;
  description: string | null | undefined;
  id: string;
  likes: number;
}

function HomePage() {
  const limit = 2;

  const [searchParams] = useSearchParams();
  
  const [sets, setSets] = useState<Set[]>([]);
  const [hits, sethits] = useState(0);

  const pages = Math.ceil(hits / limit);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params = ['getCount=true', `limit=${limit}`, `page=${page}`];
    searchParams.forEach((value, key) => {
      params.push(`${key}=${value}`);
    });
    normalAxios.get(`/api/sets?${params.join('&')}`)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          if (response.data.hits) {
            sethits(response.data.hits)
          }
          setSets(response.data.sets)
        }
      })
  }, [page, searchParams])

  function updatePage(newPage: number): void {
    if (newPage >= 1 && newPage <= pages)
    setPage(newPage);
  }

  return (
    <>
      <Header />
      {hits === 0
      ? (
        <p>Nothing found</p>
      ) : (
        <>
          {sets.map((set) => (
            <p key={set.id}>{set.name}</p>
          ))}

          <button onClick={() => updatePage(page - 1)} className='secondary-button' disabled={page === 1}>{'<'}</button>
          {[...Array(Math.min(5, pages)).keys()].map(number => {
            let offset: number = -2;
            if (page <= 2 || pages <= 5) {
              offset -= page - 3
            }
            else if (page >= pages - 1) {
              offset += pages - page - 2
            }
            const pageNumber = page + number + offset;

            return (
              <button onClick={() => updatePage(pageNumber)} key={number} className={page === pageNumber ? 'primary-button' : 'secondary-button'}>{pageNumber}</button>
            )
          })}
          <button onClick={() => updatePage(page + 1)} className='secondary-button' disabled={page === pages}>{'>'}</button>
      </>
      )}
    </>
  )
}

export default HomePage;