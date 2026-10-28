function showToast(msg, icon = 'fa-circle-check') {
    const toast = document.getElementById('toast');
    document.getElementById('toastMsg').innerText = msg;
    document.getElementById('toastIcon').className = `fa-solid ${icon} text-base`;
    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}
