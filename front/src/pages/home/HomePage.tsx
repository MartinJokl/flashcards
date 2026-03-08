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

  return (
    <>
      <Header />
      {sets.map((set) => (
        <p key={set.id}>{set.name}</p>
      ))}

      

      <p>Pages: {pages}</p>
    </>
  )
}

export default HomePage;