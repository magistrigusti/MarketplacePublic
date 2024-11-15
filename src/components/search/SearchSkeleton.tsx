const SearchSkeleton = () => {
  return (
      <div className="skeleton p-3">
        <div className='search__messageLoading py-2 flex'> 
            <div className="search__image mr-2" />
            <div className="w-full">
                <p className="mb-5 w-20 h-3">{'LOADING'}</p>
                <p className="h-3 mb-3">{'LOADING'}</p>
                <p className="h-3 mb-3">{'LOADING LOADING'}</p>
                <p className="mb-5 w-14 h-3">{'LOADING'}</p>
            </div>
            <span
                className="search__ripple"
                style={{
                    // animationDelay: `${(index || 0) * 100}ms`,
                    animationDelay: `${1 * 100}ms`,
                }}
                />
        </div>
    </div>
  )
}

export default SearchSkeleton