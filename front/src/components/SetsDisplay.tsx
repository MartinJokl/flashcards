import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { normalAxios } from "../axiosInstance";
import type { AxiosResponse } from "axios";
import type { Set } from '../types/set';
import type { SetsResponse } from "../types/responses";
import SetDisplay from "./SetDisplay";
import './SetsDisplay.css'
import type { User } from "../types/user";
import UserContext from "../contexts/UserContext";

function SetsDisplay() {
  const limit: number = 10;

  const [searchParams, setSearchParams] = useSearchParams();
  const user: User | null = useContext(UserContext)!.user;
  
  const [sets, setSets] = useState<Set[]>([]);
  const [hits, sethits] = useState(0);

  const pages: number = Math.ceil(hits / limit);
  const page: number = Number(searchParams.get('page') ?? 1)
  if (page > pages) {
    updatePage(pages);
  }

  useEffect(() => {
    const params = new URLSearchParams([['getCount', 'true'], ['limit', String(limit)]])
    if (user) {
      params.append('potencialLiker', user.id);
    }
    searchParams.forEach((value: string, key: string) => {
      params.append(key, value);
    });
    if (!params.get('page')) {
      params.append('page', '1');
    }

    normalAxios.get(`/api/sets?${params.toString()}`)
      .then((response: AxiosResponse<SetsResponse>) => {
        if (response.status === 200) {
          if (response.data.hits) {
            sethits(response.data.hits)
          }
          setSets(response.data.sets)
        }
      })
  }, [page, searchParams, user])

  function updatePage(newPage: number): void {
    if (newPage >= 1 && newPage <= pages) {
      setSearchParams(previousParams => {
        previousParams.set('page', String(newPage))
        return previousParams;
      })
    }
  }

  return (
    <>
      {hits === 0
      ? (
        <p className="sets-display-nothing">Nothing found</p>
      ) : (
        <div className="sets-display-container">
          {sets.map((set) => (
            <SetDisplay set={set} key={set.id} />
          ))}
          <div className="page-button-container">
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
          </div>
      </div>
      )}
    </>
  )
}

export default SetsDisplay;