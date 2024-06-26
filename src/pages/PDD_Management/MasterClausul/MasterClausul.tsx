import React, { ChangeEvent, useEffect, useState } from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import { Transition } from '@headlessui/react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { api } from '../../../api/master_clausul';
import {
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiPenTool,
  FiPlusSquare,
  FiSearch,
  FiTrash,
} from 'react-icons/fi';
import LoadFetch from '../../../common/Loader/LoadFetch';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import ConfirmDelete from '../../../components/Modal/ConfirmDelete';
import TableFilteringReal from '../../../common/Loader/TableFilteringReal';

const MasterClausul: React.FC = () => {
  const [clausulList, setClausulList] = useState<any>();

  const [idDel, setIdDel] = useState<number | null>();
  const [successDelete, setSuccessDel] = useState<boolean>(false);
  const [modalConfirmDelete, setShowModal] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [isPaginating, setPaginating] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    api
      .clausulAll(setLoading, 1, setPaginating)
      .then((res) => setClausulList(res));
  }, []);
  const handlePaginate = (target_page: number) => {
    setPaginating(true);
    api
      .clausulAll(setLoading, target_page, setPaginating)
      .then((res) => setClausulList(res));
  };

  const navigate: NavigateFunction = useNavigate();

  const handleRemove = (id: number) => {
    setIdDel(id);
    setShowModal(true);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    setTimeout(() => {
      if (search.length > 3) {
        setPaginating(true);
        api
          .clausulAll(setLoading, 1, setPaginating, search)
          .then((res) => setClausulList(res));
      } else if (search.length == 0) {
        setPaginating(true);
        api
          .clausulAll(setLoading, 1, setPaginating, search)
          .then((res) => setClausulList(res));
      }
    }, 400);
  }, [search]);

  useEffect(() => {
    if (successDelete == true) {
      setLoading(true);
      api
        .clausulAll(setLoading, 1, setPaginating)
        .then((res) => {
          setClausulList(res);
          setShowModal(false);
        })
        .catch((err) => console.log(err));
    }
  }, [successDelete]);

  return (
    <>
      <DefaultLayout>
        <ConfirmDelete
          id={idDel}
          modalConfirmDelete={modalConfirmDelete}
          setShowModal={setShowModal}
          target="DEL-CLAUSUL"
          message="Menghapus clausul menyebabkan hilangnya atau terhapusnya pedoman audit pada setiap proses audit yang ada"
          setSuccessDel={setSuccessDel}
        />
        <Transition
          show={loading}
          enter="transform transition duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transform duration-300 transition ease-in-out"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="w-full h-full flex justify-center items-center"
        >
          <LoadFetch />{' '}
        </Transition>
        <div className="mb-12">
          <Transition
            show={!loading}
            enter="transform transition duration-300 delay-[100ms]"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transform duration-300 transition ease-in-out"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className="text-slate-700 font-bold flex items-center flex-col md:flex-row justify-between"
          >
            <Breadcrumb
              pageName="Data Clausul"
              description={
                'Seluruh proses dan temuan audit berpedoman pada standar clausul'
              }
            />
            <button
              onClick={() => navigate('/master/clausul/create')}
              className="flex text-white bg-yellow-500 px-2.5 py-1.5 rounded-md justify-start items-center gap-3 hover:bg-yellow-700 transition-all"
            >
              <FiPlusSquare className="text-2xl" />
              <span className="font-medium">Clausul Baru</span>
            </button>
          </Transition>

          <Transition
            show={!loading}
            enter="transform transition duration-300 delay-[100ms]"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transform duration-300 transition ease-in-out"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className="relative mt-4 mb-6 ms-4"
          >
            <FiSearch className="absolute h-full flex items-center text-slate-600 -top-0.5 text-lg" />
            <input
              type="search"
              name="search"
              autoComplete="off"
              id="search"
              required
              value={search}
              onChange={handleSearch}
              placeholder="Cari Berdasarkan Judul Clausul"
              className="w-full font-semibold text-slate-600 rounded-sm border-b-2 ps-9 bg-transparent px-3 py-2 outline-none focus:border-blue-500 border-slate-500"
            />
          </Transition>

          {/* Grup Auditor List */}
          <Transition
            show={!loading}
            enter="transform transition duration-300 delay-[300ms]"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transform duration-300 transition ease-in-out"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className={'mb-8'}
          >
            <div className="rounded-md shadow-default bg-white px-5 py-5">
              <div className="max-w-full overflow-x-auto">
                {/* Tables */}
                <table className="w-full table-auto mb-4">
                  <thead>
                    <tr className="bg-slate-700 text-left">
                      <th className="min-w-[50px] p-3 font-medium text-white">
                        No
                      </th>
                      <th className="min-w-[120px] p-3 font-medium text-white">
                        Kode
                      </th>
                      <th className="min-w-[150px] p-3 font-medium text-white">
                        Judul Clausul
                      </th>
                      <th className="min-w-[150px] p-3 font-medium text-white">
                        Standar ISO
                      </th>
                      <th className="p-3 font-medium text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isPaginating
                      ? Array(3)
                          .fill([])
                          .map((basoka: any, theindex: number) => (
                            <tr key={theindex}>
                              {Array(5)
                                .fill([])
                                .map((aduhai: any, auindex: number) => (
                                  <TableFilteringReal key={auindex} />
                                ))}
                            </tr>
                          ))
                      : clausulList?.data?.data?.map(
                          (item: any, index: number) => (
                            <tr key={index}>
                              <td className="border-b border-[#eee] dark:border-strokedark p-3">
                                <h5 className="font-medium text-black dark:text-white">
                                  {index + 1}
                                </h5>
                              </td>
                              <td className="border-b border-[#eee] dark:border-strokedark p-3">
                                <h5 className="font-medium text-black dark:text-white">
                                  {item?.kode}
                                </h5>
                              </td>
                              <td className="border-b border-[#eee] dark:border-strokedark p-3">
                                <h5 className="font-medium text-black dark:text-white">
                                  {item?.judul_clausul ?? '-'}
                                </h5>
                              </td>
                              <td className="border-b border-[#eee] dark:border-strokedark p-3">
                                <h5 className="font-medium text-black dark:text-white">
                                  {item?.iso?.kode ?? '-'}
                                </h5>
                              </td>
                              <td className="border-b border-[#eee] dark:border-strokedark p-3">
                                <div className="flex justify-start items-center gap-3">
                                  <button
                                    onClick={() =>
                                      navigate(
                                        `/master/clausul/detail/${item?.id}`,
                                      )
                                    }
                                    className="flex text-white bg-emerald-500 px-2.5 py-1.5 rounded-md justify-start items-center gap-3 hover:bg-emerald-800 transition-all"
                                  >
                                    <FiEye className="" />
                                    <span className="font-medium">Detail</span>
                                  </button>
                                  <button
                                    onClick={() =>
                                      navigate(
                                        `/master/clausul/edit/${item?.id}`,
                                      )
                                    }
                                    className="flex text-white bg-blue-500 px-2.5 py-1.5 rounded-md justify-start items-center gap-3 hover:bg-blue-800 transition-all"
                                  >
                                    <FiPenTool className="" />
                                    <span className="font-medium">Edit</span>
                                  </button>
                                  <button
                                    onClick={() => handleRemove(item?.id)}
                                    className="flex text-white bg-red-500 px-2.5 py-1.5 rounded-md justify-start items-center gap-3 hover:bg-red-800 transition-all"
                                  >
                                    <FiTrash className="" />
                                    <span className="font-medium">Hapus</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ),
                        )}
                  </tbody>
                </table>

                {/* Meta Paginate */}
                <div className="m-2">
                  <nav className="flex justify-between items-center">
                    <ul className="flex flex-wrap items-center gap-3">
                      <li>
                        <button
                          disabled={
                            clausulList?.meta_paginate?.current_page == 1
                          }
                          onClick={() =>
                            handlePaginate(
                              clausulList?.meta_paginate?.current_page - 1,
                            )
                          }
                          className="flex disabled:cursor-not-allowed disabled:opacity-40 h-9 gap-2 px-2 items-center justify-center rounded-md border border-stroke  hover:border-primary hover:bg-gray hover:text-primary dark:border-strokedark dark:hover:border-primary dark:hover:bg-graydark"
                        >
                          <FiChevronLeft className="text-2xl text-slate-600" />
                          <span className="text-black font-medium">Prev</span>
                        </button>
                      </li>
                      <li>
                        <button
                          disabled={
                            clausulList?.meta_paginate?.current_page ==
                            clausulList?.meta_paginate?.last_page
                          }
                          onClick={() =>
                            handlePaginate(
                              clausulList?.meta_paginate?.current_page + 1,
                            )
                          }
                          className="flex h-9 disabled:cursor-not-allowed disabled:opacity-40 gap-2 px-2 items-center justify-center rounded-md border border-stroke  hover:border-primary hover:bg-gray hover:text-primary dark:border-strokedark dark:hover:border-primary dark:hover:bg-graydark"
                        >
                          <span className="text-black font-medium">Next</span>
                          <FiChevronRight className="text-2xl text-slate-600" />
                        </button>
                      </li>
                    </ul>
                    <div className="me-3 flex gap-3 items-center">
                      <div className="mt-1">
                        <span className="font-semibold text-xl">
                          {clausulList?.meta_paginate?.current_page}
                        </span>
                        <span className="mx-1">/</span>
                        <span className="">
                          {clausulList?.meta_paginate?.last_page}
                        </span>
                      </div>
                      <span className="text-3xl font-regular">|</span>
                      <div className="mt-1">
                        Total {clausulList?.total_clausul} Judul Clausul
                      </div>
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </DefaultLayout>
    </>
  );
};

export default MasterClausul;
