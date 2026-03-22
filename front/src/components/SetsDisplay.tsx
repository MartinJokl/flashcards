import { useContext, useEffect, useState, type ChangeEvent } from "react";
import { useSearchParams } from "react-router";
import { normalAxios } from "../axiosInstance";
import type { AxiosResponse } from "axios";
import type { Set } from '../types/set';
import type { SetsResponse, UserResponse } from "../types/responses";
import SetDisplay from "./SetDisplay";
import './SetsDisplay.css'
import type { User } from "../types/user";
import UserContext from "../contexts/UserContext";

function SetsDisplay() {
  const limit: number = 10;

  const [searchParams, setSearchParams] = useSearchParams();
  const user: User | null = useContext(UserContext)!.user;
  
  const [sets, setSets] = useState<Set[]>([]);
  const [hits, setHits] = useState(0);
  const [creatorName, setCreatorName] = useState<string | null>(null)

  const [sort, setSort] = useState('-likes');
  const [likedFilter, setLikedFilter] = useState(false);
  const [mySetFilter, setMySetFilter] = useState(false);

  const pages: number = Math.ceil(hits / limit);
  const page: number = Number(searchParams.get('page') ?? 1)
  if (page > pages) {
    updatePage(pages);
  }

  useEffect(() => {
    const params = new URLSearchParams([['getCount', 'true'], ['limit', String(limit)], ['sort', sort]])
    searchParams.forEach((value: string, key: string) => {
      params.append(key, value);
    });
    if (likedFilter) {
      params.append('likerId', user?.id ?? 'no')
    }
    if (mySetFilter) {
      const userId = user?.id ?? 'no'
      if (!params.has('createdBy') || params.get('createdBy') !== userId) {
        params.append('createdBy', userId);
      }
    }
    if (user) {
      params.append('potencialLiker', user.id);
    }
    if (!params.get('page')) {
      params.append('page', '1');
    }

    normalAxios.get(`/api/sets?${params.toString()}`)
      .then((response: AxiosResponse<SetsResponse>) => {
        if (response.status === 200) {
          if (response.data.hits !== undefined) {
            setHits(response.data.hits)
          }
          setSets(response.data.sets)
        }
        else {
          setHits(0);
          setSets([]);
        }
      });

  }, [page, searchParams, user, sort, likedFilter, mySetFilter])
  useEffect(() => {
    if (searchParams.has('createdBy')) {
      normalAxios.get(`/api/accounts/${searchParams.get('createdBy')}`)
        .then((response: AxiosResponse<UserResponse>) => {
          if (response.status === 200) {
            setCreatorName(response.data.username);
          }
          else {
            setCreatorName('User does not exist');
          }
        })
    }
    else if (creatorName !== '') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCreatorName('');
    }
  }, [creatorName, searchParams])

  function updatePage(newPage: number): void {
    if (newPage >= 1 && newPage <= pages) {
      setSearchParams(previousParams => {
        previousParams.set('page', String(newPage))
        return previousParams;
      })
    }
  }

  function changeSort(event: ChangeEvent<HTMLSelectElement, HTMLSelectElement>): void {
    setSort(event.target.value);
  }
  function changeLikedFilter(event: ChangeEvent<HTMLInputElement, HTMLInputElement>): void {
    setLikedFilter(event.target.checked);
  }
  function changeMySetFilter(event: ChangeEvent<HTMLInputElement, HTMLInputElement>): void {
    setMySetFilter(event.target.checked);
  }

  return (
    <div className="sets-display-everything-container">
      <div className="sets-display-options">
        <div>
          <span>Sort: </span>
          <select className="sets-display-sort-selector" value={sort} onChange={changeSort}>
            <option value="-likes">Most liked</option>
            <option value="-createdAt">Newest</option>
            <option value="createdAt">Oldest</option>
          </select>
        </div>
        <div>
          <span>Liked</span>
          <input type="checkbox" checked={likedFilter} onChange={changeLikedFilter} />
        </div>
        <div>
          <span>My set</span>
          <input type="checkbox" checked={mySetFilter} onChange={changeMySetFilter} />
        </div>
      </div>
      {hits === 0
      ? (
        <p className="sets-display-nothing">Nothing found</p>
      ) : (
        <div className="sets-display-container">
          {creatorName && <h1 className="sets-display-creator">Sets from {creatorName}</h1>}
          {sets.map((set) => (
            <SetDisplay set={set} key={set.id} />
          ))}
          <div className="page-button-container">
            <button onClick={() => updatePage(page - 1)} disabled={page === 1}>{'<'}</button>
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
                <button onClick={() => updatePage(pageNumber)} key={number} className={page === pageNumber ? 'primary-button' : ''}>{pageNumber}</button>
              )
            })}
            <button onClick={() => updatePage(page + 1)} disabled={page === pages}>{'>'}</button>
          </div>
      </div>
      )}
    </div>
  )
}

export default SetsDisplay;