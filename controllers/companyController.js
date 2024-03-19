const Company = require("../models/companyModel")


exports.company = async(req,res)=>{
 
    try {
        const{ Company_Name,Company_Email, Company_Phone,Company_ID, Company_Address,Company_Type, Other} = req.body
   
        const Newcompany = new Company({
            Company_Name,Company_Email, Company_Phone,Company_ID, Company_Address,Company_Type, Other
        });
        await Newcompany.save();
        res.status(201).json({ message: "Company added successfully", Newcompany });
       
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
        
    }
   
  exports.get_company = async (req,res)=>{
    try {
        const companyProfile = await Company.findOne();
        res.json(companyProfile);
    } catch (error) {
        console.error('Error fetching company profile:', error);
        res.status(500).json({ error: 'Failed to fetch company profile' });
    }
  };


exports.update_company = async (req, res) => {
    const { Company_Name, Company_Email, Company_Phone, Company_ID, Company_Address, Company_Type, Other } = req.body;

    try {
        // Find the company to update based on Company_ID or any other unique identifier
        const existingCompany = await Company.findOne({ Company_ID });

        if (!existingCompany) {
            return res.status(404).json({ error: "Company not found" });
        }

        // Update the company details
        existingCompany.Company_Name = Company_Name;
        existingCompany.Company_Email = Company_Email;
        existingCompany.Company_Phone = Company_Phone;
        existingCompany.Company_ID = Company_ID;
        existingCompany.Company_Address = Company_Address;
        existingCompany.Company_Type = Company_Type;
        existingCompany.Other = Other;

        await existingCompany.save();

        return res.json({ message: "Company updated successfully", company: existingCompany });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};




  