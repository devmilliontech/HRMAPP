import React from 'react'
import { Formik } from 'formik'

const AppForm = ({ initialValues, onSubmit, validationSchema, children }) => {

    return (
        <Formik validationSchema={validationSchema} initialValues={initialValues} onSubmit={(values, { resetForm }) => onSubmit(values, resetForm)}>
            {() => children}
        </Formik>
    )
}

export default AppForm