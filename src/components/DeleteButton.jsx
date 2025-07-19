import React, { useState } from 'react';
import { toast } from 'react-toastify';

const DeleteButton = ({
  buttonText = "Delete",
  modalId = "my_modal_8", 
  onConfirmDelete = () => {},
  onOpenModal = () => {},
  item = null
}) => {

  const handleClick = () => {
    onOpenModal();
    const modal = document.getElementById(modalId);
    if (modal) modal.showModal();
    else console.warn(`Modal with id '${modalId}' not found.`);
  };

  const handleDelete = async () => {
    try {
      await onConfirmDelete();
       document.getElementById(modalId).close();

    } catch (error) {
      console.error("Delete error:", error);
       document.getElementById(modalId).close();

    }
  };

  return (
    <>
      <button
        className="btn border-none text-white font-bold text-xs rounded-lg"
        style={{
          width: '80px',
          padding: '5px',
          height: '35px',
          background: 'linear-gradient(to right, #A1B1D1, #697C9B)',
          cursor: 'pointer',
        }}
        onClick={handleClick}
      >
        { buttonText}
      </button>

      <dialog id={modalId} className="modal">
        <div className="modal-box bg-white text-center py-8 px-6 relative font-[Open_Sans]
          max-w-[90vw] aspect-[3/3]
          sm:max-w-[70vw] sm:aspect-[3/3] 
          md:max-w-[50vw] md:aspect-[16/12]
          lg:max-w-[35vw] lg:aspect-[1/1]
          xl:max-w-[30vw] xl:aspect-[4/3]
          2xl:max-w-[25vw] 2xl:aspect-[21/9]">
          {/* Icon */}
          <div className="flex justify-center mb-4" style={{opacity:'.5'}}>
            <div className="text-orange-400 text-6xl">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth=".7" stroke="currentColor" className="w-30 h-30">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12v-.008zM12 3.75c4.556 0 8.25 3.694 8.25 8.25s-3.694 8.25-8.25 8.25S3.75 16.556 3.75 12 7.444 3.75 12 3.75z" />
              </svg>
            </div>
          </div>

          {/* Title & Message */}
          <h3 className="text-lg font-semibold text-gray-500" style={{margin:'20px'}}>Are you sure?</h3>
          <p className="text-sm text-gray-500" style={{margin:'20px'}}>You won't be able to revert this!</p>

          {/* Actions */}
          <div className="flex justify-center gap-4">
            <button
              className="btn border-none text-xs bg-red-500 font-bold text-white hover:bg-red-600 px-6"
              onClick={() => {
                          document.getElementById(modalId).close();
                          document.getElementById('my_modal_cancel').showModal();
                        }}
              style={{width:'100px'}}
            >
              No, cancel!
            </button>
            <button
              className="btn text-xs border-none bg-green-500 font-bold text-white hover:bg-green-600 px-6"
              onClick={handleDelete}
              style={{width:'100px'}}
            >
              {'Yes, delete it!'}
            </button>
          </div>
        </div>
      </dialog>
      <dialog id="my_modal_cancel" className="modal">
       
       
         <div className="modal-box bg-white text-center py-10 px-8 relative font-[Open Sans]  max-w-[90vw] aspect-[3/3]      /* Mobile: 4:3 ratio */
                            sm:max-w-[70vw] sm:aspect-[3/3] 
                            md:max-w-[50vw] md:aspect-[16/12]
                            lg:max-w-[35vw] lg:aspect-[1/1]
                            xl:max-w-[30vw] xl:aspect-[4/3]
                            2xl:max-w-[25vw] 2xl:aspect-[21/9] "
         onClick={() => {
           
             document.getElementById('my_modal_cancel').close();
           
         }}>
           {/* Icon */}
           <div className="flex justify-center mb-4" style={{opacity:'.5'}}>
             <div className="text-blue-400 text-6xl">
               <svg
                 xmlns="http://www.w3.org/2000/svg"
                 fill="none"
                 viewBox="0 0 24 24"
                 strokeWidth=".7"
                 stroke="currentColor"
                 className="w-30 h-30"
               >
                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12v-.008zM12 3.75c4.556 0 8.25 3.694 8.25 8.25s-3.694 8.25-8.25 8.25S3.75 16.556 3.75 12 7.444 3.75 12 3.75z" />
               </svg>
             </div>
           </div>
       
           {/* Title & Message */}
           <h3 className="text-3xl font-bold text-gray-500 " style={{margin:'20px'}}>Cancelled</h3>
           <p className="text-lg text-gray-500  font-semibold " style={{margin:'20px'}}>Your {item} is  safe</p>
           <button className="btn border-none bg-blue-500 w-[150px] text-white rounded-lg" > Okay</button>
       
           
         </div>
       </dialog>
    </>
  );
};

export default DeleteButton;