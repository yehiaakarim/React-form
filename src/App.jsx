import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  
  const loadSavedData = () => {
    const savedData = localStorage.getItem('jobApplicationData');
    return savedData ? JSON.parse(savedData) : {
      personalInfo: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        jobTitle: "",
        address: "",
        city: "",
        country: "",
        postalCode: "",
        linkedIn: "",
        portfolio: ""
      },
      education: [
        {
          institution: "",
          degree: "",
          fieldOfStudy: "",
          startDate: "",
          endDate: "",
          description: ""
        }
      ],
      experience: [
        {
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          responsibilities: ""
        }
      ],
      skills: [],
      newSkill: "",
      references: [
        {
          name: "",
          position: "",
          company: "",
          phone: "",
          email: ""
        }
      ],
      references: [  
        {
          name: "",
          position: "",
          company: "",
          phone: "",
          email: ""
        }
      ],
      cvFile: null,
      cvFileName: ""
    };
  };

  const [formData, setFormData] = useState(loadSavedData());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentSection, setCurrentSection] = useState("personal");

  
  useEffect(() => {
    localStorage.setItem('jobApplicationData', JSON.stringify({
      ...formData,
      cvFile: null 
    }));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    
    if (name.startsWith("personalInfo.")) {
      const field = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          [field]: value
        }
      }));
      return;
    }
    
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (section, index, e) => {
    const { name, value } = e.target;
    const updatedSection = [...formData[section]];
    updatedSection[index][name] = value;
    
    setFormData(prev => ({
      ...prev,
      [section]: updatedSection
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (!value && e.target.required) {
      e.target.style.borderColor = '#e74c3c';
    } else {
      e.target.style.borderColor = '#3498db';
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    
    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage("File size exceeds 2MB limit");
      return;
    }

    
    if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMessage("Please upload a PDF file");
      return;
    }

    setErrorMessage("");
    setFormData(prev => ({
      ...prev,
      cvFile: file,
      cvFileName: file.name
    }));
  };

  const addNewEntry = (section) => {
    let newEntry;
    switch(section) {
      case "education":
        newEntry = {
          institution: "",
          degree: "",
          fieldOfStudy: "",
          startDate: "",
          endDate: "",
          description: ""
        };
        break;
      case "experience":
        newEntry = {
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          responsibilities: ""
        };
        break;
      case "references":
        newEntry = {
          name: "",
          position: "",
          company: "",
          phone: "",
          email: ""
        };
        break;
      default:
        return;
    }
    
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], newEntry]
    }));
  };

  const removeEntry = (section, index) => {
    const updatedSection = formData[section].filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      [section]: updatedSection
    }));
  };

  const handleSkillChange = (e) => {
    setFormData(prev => ({
      ...prev,
      newSkill: e.target.value
    }));
  };

  const addSkill = () => {
    if (formData.newSkill.trim() && !formData.skills.includes(formData.newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, prev.newSkill.trim()],
        newSkill: ""
      }));
    }
  };

  const removeSkill = (index) => {
    const updatedSkills = formData.skills.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      skills: updatedSkills
    }));
  };

  const validateForm = () => {
    
    const requiredPersonalFields = ['firstName', 'lastName', 'email', 'phone'];
    const missingPersonalFields = requiredPersonalFields.filter(
      field => !formData.personalInfo[field]
    );
    
    if (missingPersonalFields.length > 0) {
      setErrorMessage("Please fill in all required personal information fields");
      setCurrentSection("personal");
      return false;
    }
    
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.personalInfo.email)) {
      setErrorMessage("Please enter a valid email address");
      setCurrentSection("personal");
      return false;
    }
    
    
    if (!/^\d{6,}$/.test(formData.personalInfo.phone.replace(/\D/g, ''))) {
      setErrorMessage("Please enter a valid phone number");
      setCurrentSection("personal");
      return false;
    }
    
    if (!formData.cvFile) {
      setErrorMessage("Please upload your CV");
      setCurrentSection("personal");
      return false;
    }
    
    
    if (formData.education.length === 0) {
      setErrorMessage("Please add at least one education entry");
      setCurrentSection("education");
      return false;
    }
    
    const invalidEducation = formData.education.some(edu => 
      !edu.institution || !edu.degree || !edu.startDate
    );
    
    if (invalidEducation) {
      setErrorMessage("Please fill in all required education fields (Institution, Degree, and Start Date)");
      setCurrentSection("education");
      return false;
    }
    
    
    if (formData.experience.length === 0) {
      setErrorMessage("Please add at least one work experience entry");
      setCurrentSection("experience");
      return false;
    }
    
    const invalidExperience = formData.experience.some(exp => 
      !exp.company || !exp.position || !exp.startDate
    );
    
    if (invalidExperience) {
      setErrorMessage("Please fill in all required experience fields (Company, Position, and Start Date)");
      setCurrentSection("experience");
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    
    const applicationData = {
      ...formData,
      cvFile: null, 
      cvFileName: formData.cvFileName
    };
    
    localStorage.setItem('jobApplicationData', JSON.stringify(applicationData));
    localStorage.setItem('jobApplicationSubmitted', 'true');
    
    setIsSubmitted(true);
    setErrorMessage("");
  };

  const resetForm = () => {
    localStorage.removeItem('jobApplicationData');
    localStorage.removeItem('jobApplicationSubmitted');
    setFormData(loadSavedData());
    setIsSubmitted(false);
  };

  
  useEffect(() => {
    const wasSubmitted = localStorage.getItem('jobApplicationSubmitted');
    if (wasSubmitted) {
      setIsSubmitted(true);
    }
  }, []);

  if (isSubmitted) {
    return (
      <div className="container submitted-container">
        <h1>Application Submitted Successfully!</h1>
        <div className="submitted-info">
          <h2>Thank you, {formData.personalInfo.firstName} {formData.personalInfo.lastName}!</h2>
          <p>We've received your application and will review it shortly.</p>
          <p>we will contact you at {formData.personalInfo.email} to schedule an interview.</p>
          {formData.cvFileName && (
            <p>Uploaded CV: {formData.cvFileName}</p>
          )}
        </div>
        <button onClick={resetForm} className="btn">Submit Another Application</button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Job Application Form</h1>
      <p>Please fill out all required fields to submit your application.</p>
      
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      
      <div className="form-nav">
        <button 
          className={`nav-btn ${currentSection === "personal" ? "active" : ""}`}
          onClick={() => setCurrentSection("personal")}
        >
          Personal Info
        </button>
        <button 
          className={`nav-btn ${currentSection === "education" ? "active" : ""}`}
          onClick={() => setCurrentSection("education")}
        >
          Education
        </button>
        <button 
          className={`nav-btn ${currentSection === "experience" ? "active" : ""}`}
          onClick={() => setCurrentSection("experience")}
        >
          Experience
        </button>
        <button 
          className={`nav-btn ${currentSection === "skills" ? "active" : ""}`}
          onClick={() => setCurrentSection("skills")}
        >
          Skills
        </button>
        <button 
          className={`nav-btn ${currentSection === "references" ? "active" : ""}`}
          onClick={() => setCurrentSection("references")}
        >
          Submit Here
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        {currentSection === "personal" && (
          <div className="form-section">
            <h2>Personal Informations</h2>
            <div className="form-group">
              <label required>First Name</label>
              <input
                type="text"
                name="personalInfo.firstName"
                value={formData.personalInfo.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
            </div>
            <div className="form-group">
              <label required>Last Name</label>
              <input
                type="text"
                name="personalInfo.lastName"
                value={formData.personalInfo.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
            </div>
            <div className="form-group">
              <label required>Email</label>
              <input
                type="email"
                name="personalInfo.email"
                value={formData.personalInfo.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
            </div>
            <div className="form-group">
              <label required>Phone</label>
              <input
                type="tel"
                name="personalInfo.phone"
                value={formData.personalInfo.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
            </div>
            <div className="form-group">
              <label required>Job title</label>
              <input
                type="text"
                name="personalInfo.jobTitle"
                value={formData.personalInfo.jobTitle}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
            </div>
            <div className="form-group">
              <label required>Address</label>
              <input
                type="text"
                name="personalInfo.address"
                value={formData.personalInfo.address}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label required>City</label>
                <input
                  type="text"
                  name="personalInfo.city"
                  value={formData.personalInfo.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
              </div>
              <div className="form-group">
                <label required>Country</label>
                <input
                  type="text"
                  name="personalInfo.country"
                  value={formData.personalInfo.country}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
              </div>
              <div className="form-group">
                <label>Postal Code</label>
                <input
                  type="text"
                  name="personalInfo.postalCode"
                  value={formData.personalInfo.postalCode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            </div>
            <div className="form-group">
              <label required>LinkedIn Profile</label>
              <input
                type="url"
                name="personalInfo.linkedIn"
                value={formData.personalInfo.linkedIn}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="https://linkedin.com/yourprofile"
                required
              />
            </div>
            <div className="form-group">
              <label>Portfolio Website (optional)</label>
              <input
                type="url"
                name="personalInfo.portfolio"
                value={formData.personalInfo.portfolio}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="https://yourportfolio.com"
              />
            </div>
            <div className="form-group">
              <label required>Upload CV (PDF, max 2MB)</label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                onBlur={handleBlur}
                required
              />
              {formData.cvFileName && (
                <div className="file-info">
                  Selected file: {formData.cvFileName}
                </div>
              )}
            </div>
          </div>
        )}
        
        {currentSection === "education" && (
          <div className="form-section">
            <h2>Education</h2>
            {formData.education.map((edu, index) => (
              <div key={index} className="education-entry">
                <div className="form-group">
                  <label required>University / Institution</label>
                  <input
                    type="text"
                    name="institution"
                    value={edu.institution}
                    onChange={(e) => handleArrayChange("education", index, e)}
                    onBlur={handleBlur}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label required>Degree</label>
                    <select
                      name="degree"
                      value={edu.degree}
                      onChange={(e) => handleArrayChange("education", index, e)}
                      onBlur={handleBlur}
                      required
                    >
                      <option value="">Select Degree</option>
                      <option value="High School">High School</option>
                      <option value="Associate">Associate</option>
                      <option value="Bachelor's">Bachelor's</option>
                      <option value="Master's">Master's</option>
                      <option value="PhD">Course Certificate</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label required>Field of Study</label>
                    <input
                      type="text"
                      name="fieldOfStudy"
                      value={edu.fieldOfStudy}
                      onChange={(e) => handleArrayChange("education", index, e)}
                      onBlur={handleBlur}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label required>Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={edu.startDate}
                      onChange={(e) => handleArrayChange("education", index, e)}
                      onBlur={handleBlur}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date (or expected)</label>
                    <input
                      type="date"
                      name="endDate"
                      value={edu.endDate}
                      onChange={(e) => handleArrayChange("education", index, e)}
                      onBlur={handleBlur}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description (optional)</label>
                  <textarea
                    name="description"
                    value={edu.description}
                    onChange={(e) => handleArrayChange("education", index, e)}
                    onBlur={handleBlur}
                    rows="3"
                  />
                </div>
                {formData.education.length > 1 && (
                  <button 
                    type="button" 
                    className="btn remove-btn"
                    onClick={() => removeEntry("education", index)}
                  >
                    Remove Education
                  </button>
                )}
                <hr />
              </div>
            ))}
            <button 
              type="button" 
              className="btn add-btn"
              onClick={() => addNewEntry("education")}
            >
              Add Another Education
            </button>
          </div>
        )}
        
        {currentSection === "experience" && (
          <div className="form-section">
            <h2>Work Experience</h2>
            {formData.experience.map((exp, index) => (
              <div key={index} className="experience-entry">
                <div className="form-group">
                  <label required>Company Name</label>
                  <input
                    type="text"
                    name="company"
                    value={exp.company}
                    onChange={(e) => handleArrayChange("experience", index, e)}
                    onBlur={handleBlur}
                    required
                  />
                </div>
                <div className="form-group">
                  <label required>Position</label>
                  <input
                    type="text"
                    name="position"
                    value={exp.position}
                    onChange={(e) => handleArrayChange("experience", index, e)}
                    onBlur={handleBlur}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label required>Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={exp.startDate}
                      onChange={(e) => handleArrayChange("experience", index, e)}
                      onBlur={handleBlur}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={exp.endDate}
                      onChange={(e) => handleArrayChange("experience", index, e)}
                      onBlur={handleBlur}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Responsibilities (optional)</label>
                  <textarea
                    name="responsibilities"
                    value={exp.responsibilities}
                    onChange={(e) => handleArrayChange("experience", index, e)}
                    onBlur={handleBlur}
                    rows="4"
                  />
                </div>
                {formData.experience.length > 1 && (
                  <button 
                    type="button" 
                    className="btn remove-btn"
                    onClick={() => removeEntry("experience", index)}
                  >
                    Remove Experience
                  </button>
                )}
                <hr />
              </div>
            ))}
            <button 
              type="button" 
              className="btn add-btn"
              onClick={() => addNewEntry("experience")}
            >
              Add Another Experience
            </button>
          </div>
        )}
                {currentSection === "skills" && (
          <div className="form-section">
            <h2>Skills (optional)</h2>
            <div className="skills-container">
              {formData.skills.map((skill, index) => (
                <div key={index} className="skill-tag">
                  {skill}
                  <button 
                    type="button" 
                    className="skill-remove"
                    onClick={() => removeSkill(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  name="newSkill"
                  value={formData.newSkill}
                  onChange={handleSkillChange}
                  onBlur={handleBlur}
                  placeholder="Add a skill"
                />
              </div>
              <button 
                type="button" 
                className="btn add-btn"
                onClick={addSkill}
              >
                Add Skill
              </button>
            </div>
            <div className="form-group">
              <label>Additional Notes</label>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                rows="4"
              />
            </div>
          </div>
        )}
                {currentSection === "references" && (
          <div className="form-section">
            <h2>Who Recommended Us (optional)</h2>
           {formData.references?.map((ref, index) =>  (
              <div key={index} className="reference-entry">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={ref.name}
                    onChange={(e) => handleArrayChange("references", index, e)}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="form-group">
                  <label>Position</label>
                  <input
                    type="text"
                    name="position"
                    value={ref.position}
                    onChange={(e) => handleArrayChange("references", index, e)}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="form-group">
                  <label>Company</label>
                  <input
                    type="text"
                    name="company"
                    value={ref.company}
                    onChange={(e) => handleArrayChange("references", index, e)}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={ref.phone}
                      onChange={(e) => handleArrayChange("references", index, e)}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={ref.email}
                      onChange={(e) => handleArrayChange("references", index, e)}
                      onBlur={handleBlur}
                    />
                  </div>
                </div>
                {formData.references.length > 1 && (
                  <button 
                    type="button" 
                    className="btn remove-btn"
                    onClick={() => removeEntry("references", index)}
                  >
                    Remove Reference
                  </button>
                )}
                <hr />
              </div>
            ))}
            <button 
              type="button" 
              className="btn add-btn"
              onClick={() => addNewEntry("references")}
            >
              Add Another Reference
            </button>
            <div className="form-navigation">
              <button type="submit" className="btn submit-btn">Submit Application</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default App;