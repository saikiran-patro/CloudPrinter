let f=0;
const Upload = () => {
f=document.getElementById("file").value;

f=f.slice(12)
let source=''
try{
    if(f[0]==='i'){
        source='./printers/inkjet/'+f;
    
    }
    else{
        source='/printers/laser/'+f;
    }
    
}
catch(err){
    alert('Error')

}

if(f!==0){
    
    document.getElementById("PrinterImage").setAttribute("src",source)
}

alert("File uploaded successfully")


}
