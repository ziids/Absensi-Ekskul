const Error = () => {
    return (
        <>
            <div className="h-[50vh] bg-[#3A56E7] rounded-b-3xl flex flex-col items-center">

                <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                    <div className="py-5 text-center">
                        <h3 className="text-white font-semibold text-xl">WEB ABSENSI</h3>
                    </div>

                    <div className="bg-[#EFEFEF] w-[350px] p-6 rounded-xl drop-shadow-lg">
                        <div className="flex flex-col justify-center items-center">
                            <img src="/assets/error.svg" alt="error" />
                        </div>

                        <div className="flex flex-col items-center justify-between">
                            <div className="">
                                <p className="text-[#9498AD] font-bold pb-6">ERROR! PAGE NOT FOUND</p>
                            </div>
                            <div className="text-white mb-4">
                                <a className="bg-[#3A56E7] py-2 px-4 rounded-lg" href="/">BACK TO HOME</a>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-5">
                        <div className="py-1">
                            <h3 className="font-semibold text-[#3A56E7]">ILLUSTRATOR BY :</h3>
                            <a className="text-[#9498AD]" href="https://storyset.com/web">https://storyset.com/web</a>
                        </div>
                        <div className="py-1">
                            <h3 className="font-semibold text-[#3A56E7]">ICONS BY :</h3>
                            <a className="text-[#9498AD]" href="https://ionic.io/ionicons">https://ionic.io/ionicons</a>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Error;